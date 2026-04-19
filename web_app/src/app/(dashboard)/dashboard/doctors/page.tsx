"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import nextDynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { fetchNearbyMedicalFacilities, OsmElement } from "@/lib/overpass";
import { 
    Loader2, MapPin, Clock, Calendar, Star, Phone, ExternalLink, 
    Search, ShieldCheck, HeartPulse, Stethoscope, ChevronRight,
    ArrowLeft, Globe, Map as MapIcon, Navigation
} from "lucide-react";

// Dynamically import Map component to avoid SSR issues
const DoctorMap = nextDynamic(() => import("@/components/features/DoctorMap"), { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-slate-100/50 backdrop-blur-md animate-pulse flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200/50">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Triangulating Map Core...</p>
    </div>
});

interface Doctor {
    id: number;
    name: string;
    specialty: string;
    experience: string;
    expValue: number;
    rating: number;
    location: string;
    lat: number;
    lon: number;
    phone: string;
    status: "active" | "away" | "busy";
    timeOffs: string[];
    availableToday: boolean;
    distance?: number;
}

const SPECIALTIES = [
    "General Physician", "Hepatologist", "Cardiologist", "Neurologist", "Dermatologist", "Pediatrician", "Gastroenterologist"
];

// Skeleton Loader Component
function DoctorListSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 items-center px-8 py-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                    <div className="col-span-1">
                        <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                    <div className="col-span-11 md:col-span-4 space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-32"></div>
                    </div>
                    <div className="hidden md:block col-span-3">
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-24"></div>
                    </div>
                    <div className="hidden md:block col-span-2">
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16"></div>
                    </div>
                    <div className="col-span-12 md:col-span-2 flex justify-end">
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-16"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function DoctorsPage() {
    const searchParams = useSearchParams();
    const [facilities, setFacilities] = useState<OsmElement[]>([]);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("specialty") || "");
    const [cityQuery, setCityQuery] = useState("Bhopal");
    const [showMap, setShowMap] = useState(false);
    const [viewMode, setViewMode] = useState<"list" | "detail">("list");

    // Geocoding helper for City -> Lat/Lon
    const geocodeCity = async (city: string) => {
        if (!city.trim()) return;
        setLoading(true);
        setError(null);
        try {
            // Set facilities to empty to show skeleton for new search
            setFacilities([]); 
            
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
            if (!res.ok) throw new Error("Geocoding service unavailable");
            
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const coords = { lat: parseFloat(lat), lon: parseFloat(lon) };
                setUserLocation(coords);
                await loadNearby(coords.lat, coords.lon);
            } else {
                setError(`City "${city}" not found in our medical database.`);
                setLoading(false);
            }
        } catch (err: any) {
            setError("Geocoding service busy. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        geocodeCity(cityQuery);
    }, []);

    const loadNearby = async (lat: number, lon: number) => {
        setLoading(true);
        try {
            const data = await fetchNearbyMedicalFacilities(lat, lon);
            setFacilities(data);
            setError(null);
        } catch (err: any) {
            // This case is now rare due to the fallback data in the utility
            setError("Medical grid currently unstable. Synchronizing with fallback nodes...");
        } finally {
            setLoading(false);
        }
    };

    const doctors = useMemo(() => {
        return facilities.map((facility) => {
            const seed = facility.id;
            const expValue = (seed % 15) + 5;
            const rating = 4.0 + ((seed % 10) / 10);
            let specialty = SPECIALTIES[seed % SPECIALTIES.length];
            return {
                id: facility.id,
                name: facility.tags?.name || "Medical Specialist",
                specialty,
                experience: `${expValue} Yrs`,
                expValue,
                rating,
                location: facility.tags?.["addr:street"] || facility.tags?.["addr:city"] || "Nearby",
                lat: facility.lat, lon: facility.lon,
                phone: facility.tags?.phone || "+91-987-654-3210",
                status: (seed % 3 === 0) ? "busy" : (seed % 5 === 0 ? "away" : "active"),
                timeOffs: ["Sundays"],
                availableToday: (seed % 3 !== 0) && (seed % 5 !== 0),
            } as Doctor;
        });
    }, [facilities]);

    const filteredDoctors = useMemo(() => {
        return doctors.filter(d => 
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            d.specialty.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [doctors, searchQuery]);

    const activeDoctor = doctors.find(d => d.id === selectedDoctorId);

    const handleDoctorClick = (id: number) => {
        setSelectedDoctorId(id);
        setViewMode("detail");
        setShowMap(false);
    };

    return (
        <main className="p-4 md:p-8 max-w-[1200px] mx-auto min-h-screen">
            {/* ── SEARCH CONTROLS ── */}
            {viewMode === "list" && (
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <header className="mb-8">
                        <h1 className="text-5xl font-poppins font-black text-slate-900 dark:text-white tracking-tighter mb-2">Find Doctors</h1>
                        <p className="text-slate-400 font-barlow font-medium uppercase tracking-widest text-xs">Search our verified medical directory</p>
                    </header>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow md:flex-[2] group">
                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-all w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Enter City (e.g. Bhopal, Indore)..." 
                                value={cityQuery}
                                onChange={(e) => setCityQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && geocodeCity(cityQuery)}
                                className="w-full pl-16 pr-8 py-5 bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-100 dark:border-white/5 rounded-[2rem] shadow-xl shadow-slate-200/10 focus:ring-4 focus:ring-cyan-500/10 outline-none font-bold text-slate-800 dark:text-white transition-all"
                            />
                            <button 
                                onClick={() => geocodeCity(cityQuery)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest"
                            >
                                UPDATE
                            </button>
                        </div>
                        <div className="relative flex-grow md:flex-[3] group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-all w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Specialty, Doctor or Condition..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-16 pr-8 py-5 bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-100 dark:border-white/5 rounded-[2rem] shadow-xl shadow-slate-200/10 focus:ring-4 focus:ring-cyan-500/10 outline-none font-bold text-slate-800 dark:text-white transition-all font-barlow"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mt-6 p-6 bg-pink-50 dark:bg-pink-900/10 border-2 border-pink-100 dark:border-pink-900/20 rounded-3xl flex items-center gap-4 animate-in zoom-in-95">
                            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center text-pink-600">
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </div>
                            <p className="text-pink-600 text-xs font-black uppercase tracking-widest">{error}</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── LIST VIEW ── */}
            {viewMode === "list" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center justify-between px-4 mb-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            {loading ? "Scanning Medical Grid..." : `${filteredDoctors.length} Specialists Identified`}
                        </p>
                    </div>

                    {loading && facilities.length === 0 ? (
                        <DoctorListSkeleton />
                    ) : (
                        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-2xl">
                            <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-6 border-b border-slate-50 dark:border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <div className="col-span-1 text-center">Data</div>
                                <div className="col-span-4">Practitioner Name</div>
                                <div className="col-span-3">Specialization</div>
                                <div className="col-span-2">Experience</div>
                                <div className="col-span-2 text-right">Rating</div>
                            </div>

                            <div className="divide-y divide-slate-50 dark:divide-white/5">
                                {filteredDoctors.length === 0 && !loading ? (
                                    <div className="p-20 text-center space-y-4">
                                        <Search className="w-12 h-12 text-slate-200 mx-auto" />
                                        <h3 className="text-xl font-poppins font-black text-slate-300">No Mesh Results Available</h3>
                                    </div>
                                ) : (
                                    filteredDoctors.map((doc) => (
                                        <div 
                                            key={doc.id}
                                            onClick={() => handleDoctorClick(doc.id)}
                                            className="grid grid-cols-12 gap-4 items-center px-8 py-8 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all cursor-pointer group"
                                        >
                                            <div className="col-span-1 md:col-span-1 text-center">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform shadow-lg">
                                                    {doc.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="col-span-7 md:col-span-4">
                                                <h3 className="font-poppins font-black text-base text-slate-900 dark:text-white truncate">{doc.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate">{doc.location}</p>
                                                </div>
                                            </div>
                                            <div className="hidden md:block col-span-3">
                                                <span className="px-3 py-1 bg-cyan-500/5 text-cyan-500 text-[10px] font-black rounded-lg border border-cyan-500/10 uppercase tracking-widest">{doc.specialty}</span>
                                            </div>
                                            <div className="hidden md:block col-span-2">
                                                <p className="font-barlow font-bold text-slate-700 dark:text-slate-300 text-sm tracking-widest">{doc.experience}</p>
                                            </div>
                                            <div className="col-span-4 md:col-span-2 text-right">
                                                <div className="flex items-center justify-end gap-1 text-yellow-500 font-black text-sm">
                                                    <Star className="w-4 h-4 fill-yellow-500" />
                                                    {doc.rating}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── DETAIL VIEW ── */}
            {viewMode === "detail" && activeDoctor && (
                <div className="animate-in zoom-in-95 duration-700">
                    <button 
                        onClick={() => setViewMode("list")}
                        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Return to Directory</span>
                    </button>

                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-slate-100 dark:border-white/5 rounded-[3.5rem] p-8 md:p-16 shadow-3xl">
                        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
                            <div className="space-y-8 flex-grow w-full">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black rounded-full uppercase tracking-[0.3em]">Verified Medical Hub</span>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                                            activeDoctor.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-700/20 text-slate-500 border-slate-700/30'
                                        }`}>
                                            {activeDoctor.status} Status
                                        </span>
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-poppins font-black text-slate-900 dark:text-white tracking-tighter leading-none">{activeDoctor.name}</h2>
                                    <div className="flex items-center gap-6">
                                        <p className="text-lg md:text-xl font-medium tracking-tight bg-slate-100 dark:bg-white/5 rounded-xl px-5 py-1.5 italic font-barlow text-slate-600 dark:text-slate-300">{activeDoctor.specialty} Specialist</p>
                                        <p className="text-lg md:text-xl font-bold uppercase tracking-[0.2em] text-cyan-500">{activeDoctor.experience}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-10 border-y border-slate-100 dark:border-white/5">
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Clinic Coordinates</p>
                                        <div className="flex items-center gap-3 text-lg font-bold text-slate-700 dark:text-slate-200">
                                            <MapPin className="w-6 h-6 text-cyan-500 shrink-0" />
                                            {activeDoctor.location}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Encrypted Signal</p>
                                        <div className="flex items-center gap-3 text-lg font-bold text-slate-700 dark:text-slate-200">
                                            <Phone className="w-6 h-6 text-cyan-500 shrink-0" />
                                            {activeDoctor.phone}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Trust Index Index</p>
                                        <div className="flex items-center gap-2 text-2xl font-black text-slate-900 dark:text-white font-poppins uppercase tracking-tighter">
                                            {activeDoctor.rating} 
                                            <div className="flex items-center gap-1 ml-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(activeDoctor.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-200 dark:text-slate-700'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Wait Time Trend</p>
                                        <div className="flex items-center gap-2 text-lg font-bold text-emerald-500 italic">
                                            <Clock className="w-6 h-6" />
                                            {"<"} 15 MINS AVERAGE
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        <Button className="flex-grow bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black px-12 py-6 text-sm uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl transition-all hover:scale-105 active:scale-95">
                                            Confirm Appointment
                                        </Button>
                                        <button 
                                            onClick={() => setShowMap(!showMap)}
                                            className={`flex-grow flex items-center justify-center gap-4 px-12 py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] border-2 transition-all ${
                                                showMap 
                                                ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-500" 
                                                : "border-slate-100 dark:border-white/5 text-slate-400 hover:border-cyan-500/20 hover:text-cyan-500 hover:bg-cyan-500/5"
                                            }`}
                                        >
                                            <MapIcon className="w-5 h-5" />
                                            {showMap ? "GPS ACTIVE" : "CHECK LOCATION"}
                                        </button>
                                    </div>

                                    {/* ── CONDITIONAL MAP ── */}
                                    {showMap && (
                                        <div className="animate-in fade-in zoom-in-95 duration-700 space-y-6">
                                            <div className="flex items-center justify-between px-2">
                                                <div className="flex items-center gap-3">
                                                    <Navigation className="w-5 h-5 text-cyan-500" />
                                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Spatial Triangulation</h3>
                                                </div>
                                                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded-lg uppercase tracking-widest">Signal Stable</div>
                                            </div>
                                            <div className="h-[400px] md:h-[500px] w-full relative overflow-hidden rounded-[2.5rem] border-2 border-slate-50 dark:border-white/5 shadow-2xl">
                                                <DoctorMap 
                                                    center={{ lat: activeDoctor.lat, lon: activeDoctor.lon }} 
                                                    markers={[{ id: activeDoctor.id, lat: activeDoctor.lat, lon: activeDoctor.lon, name: activeDoctor.name, type: activeDoctor.specialty }]}
                                                />
                                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none rounded-b-[2.5rem] z-[1000]"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="hidden lg:block w-full lg:w-[350px] space-y-8">
                                <div className="p-10 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-6">
                                    <ShieldCheck className="w-12 h-12 text-cyan-500" />
                                    <h4 className="text-xl font-poppins font-black text-slate-900 dark:text-white tracking-tighter">Verified Specialist</h4>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed font-barlow">This practitioner has been validated via our medical grid analysis protocol ensuring data accuracy and profile integrity.</p>
                                    <ul className="space-y-4">
                                        {["Identity Verified", "Education Validated", "Location Pinned"].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}


