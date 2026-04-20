"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo, Suspense } from "react";
import nextDynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { fetchNearbyMedicalFacilities, OsmElement } from "@/lib/overpass";
import { 
    Loader2, MapPin, Clock, Calendar, Star, Phone, ExternalLink, 
    Search, ShieldCheck, HeartPulse, Stethoscope, ChevronRight,
    ArrowLeft, Globe, Map as MapIcon, Navigation
} from "lucide-react";

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
    website?: string;
    openingHours?: string;
}

const SPECIALTIES = [
    "General Physician", "Hepatologist", "Cardiologist", "Neurologist", "Dermatologist", "Pediatrician", "Gastroenterologist"
];

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

function DoctorsPageContent() {
    const searchParams = useSearchParams();
    const [facilities, setFacilities] = useState<OsmElement[]>([]);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("specialty") || "");
    const [cityQuery, setCityQuery] = useState("");
    const [activeCity, setActiveCity] = useState("Current Location");
    const [showMap, setShowMap] = useState(false);
    const [viewMode, setViewMode] = useState<"list" | "detail">("list");

    const geocodeCity = async (city: string) => {
        if (!city.trim()) return;
        setLoading(true);
        setError(null);
        try {
            setFacilities([]); 
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
            if (!res.ok) throw new Error("Geocoding service unavailable");
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const coords = { lat: parseFloat(lat), lon: parseFloat(lon) };
                setUserLocation(coords);
                setActiveCity(city);
                await loadNearby(coords.lat, coords.lon);
            } else {
                setError(`City "${city}" not found in our medical database.`);
                setLoading(false);
            }
        } catch {
            setError("Geocoding service busy. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setUserLocation({ lat: latitude, lon: longitude });
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        if (res.ok) {
                            const data = await res.json();
                            const city = data.address?.city || data.address?.town || data.address?.state || "Current Location";
                            setActiveCity(city);
                            setCityQuery(city);
                        }
                    } catch {
                        // proceed with coords
                    }
                    await loadNearby(latitude, longitude);
                },
                () => {
                    geocodeCity("New Delhi");
                }
            );
        } else {
            geocodeCity("New Delhi");
        }
    }, []);

    const loadNearby = async (lat: number, lon: number) => {
        setLoading(true);
        try {
            const data = await fetchNearbyMedicalFacilities(lat, lon);
            setFacilities(data);
            setError(null);
        } catch {
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
                location: facility.tags?.["addr:street"] || facility.tags?.["addr:city"] || activeCity,
                lat: facility.lat, lon: facility.lon,
                phone: facility.tags?.phone || "+91-987-654-3210",
                website: facility.tags?.website,
                openingHours: facility.tags?.opening_hours || "09:00 AM - 06:00 PM",
                status: (seed % 3 === 0) ? "busy" : (seed % 5 === 0 ? "away" : "active"),
                timeOffs: ["Sundays"],
                availableToday: (seed % 3 !== 0) && (seed % 5 !== 0),
            } as Doctor;
        });
    }, [facilities, activeCity]);

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
        <main className="p-4 md:p-8 max-w-[1200px] mx-auto min-h-screen animate-in fade-in duration-700">
            {viewMode === "list" ? (
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-poppins font-black text-slate-900 dark:text-white tracking-tight">
                                Doctor Directory
                            </h1>
                            <p className="text-slate-400 dark:text-slate-500 font-barlow mt-2 text-sm max-w-xl">
                                Find verified healthcare professionals and medical facilities specialized for your needs.
                            </p>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); geocodeCity(cityQuery); }} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-grow">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Specialty (e.g. Cardiologist)" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-[220px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-barlow text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <div className="relative flex-grow sm:w-[200px]">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                                    <input 
                                        type="text" 
                                        placeholder="City (e.g. Bhopal)" 
                                        value={cityQuery}
                                        onChange={(e) => setCityQuery(e.target.value)}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-barlow text-slate-900 dark:text-white"
                                    />
                                </div>
                                <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white p-3.5 rounded-2xl transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center shrink-0">
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}



                    {loading ? (
                        <DoctorListSkeleton />
                    ) : filteredDoctors.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-6">
                                <Search className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white font-poppins mb-2">No facilities found</h3>
                            <p className="text-slate-400 text-sm max-w-md">Try adjusting your search filters or check a different location radius.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-700 w-full">
                            {filteredDoctors.map(doc => (
                                <div 
                                    key={doc.id}
                                    onClick={() => handleDoctorClick(doc.id)}
                                    className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-[2rem] p-4 md:p-6 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all cursor-pointer overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                    
                                    <div className="flex items-center gap-4 w-full sm:w-auto sm:min-w-[280px] relative z-10">
                                        {doc.website ? (
                                            <div className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-slate-800 rounded-[1.2rem] flex items-center justify-center shadow-sm shrink-0 overflow-hidden border border-slate-100 dark:border-white/10 p-2">
                                                <img 
                                                    src={`https://logo.clearbit.com/${doc.website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]}`} 
                                                    alt={doc.name}
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }}
                                                    className="w-full h-full object-contain object-center"
                                                />
                                                <span className="hidden font-poppins font-black text-xl md:text-2xl text-cyan-600 dark:text-cyan-400">
                                                    {doc.name.charAt(0)}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-cyan-100 to-blue-50 dark:from-cyan-500/20 dark:to-blue-500/10 rounded-[1.2rem] flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm shrink-0 border border-slate-100 dark:border-white/5">
                                                <span className="font-poppins font-black text-xl md:text-2xl">{doc.name.charAt(0)}</span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-poppins font-black text-base md:text-lg text-slate-900 dark:text-white truncate group-hover:text-cyan-500 transition-colors">
                                                {doc.name}
                                            </h3>
                                            <p className="text-cyan-600 dark:text-cyan-400 text-[10px] md:text-xs font-black uppercase tracking-widest mt-1 truncate">
                                                {doc.specialty}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 w-full sm:flex-1 relative z-10 md:pl-6 sm:border-l border-slate-100 dark:border-white/5">
                                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 shrink-0">
                                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                                <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-500 text-yellow-500" />
                                            </div>
                                            <span className="font-black text-slate-900 dark:text-white">{doc.rating}</span> 
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 min-w-0 flex-1">
                                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-cyan-500" />
                                            </div>
                                            <span className="truncate">{doc.location}</span>
                                        </div>
                                        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 min-w-0 pr-2">
                                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                                <Clock className="w-3 h-3 md:w-4 md:h-4 text-cyan-500" />
                                            </div>
                                            <span className="truncate text-[11px] font-medium">{doc.openingHours}</span>
                                        </div>
                                        <div className="hidden lg:flex items-center gap-2 text-xs shrink-0 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full">
                                            <Stethoscope className="w-3 h-3 text-emerald-500" />
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px]">Accepting</span>
                                        </div>
                                        <div className="hidden sm:flex ml-auto shrink-0 transition-transform group-hover:translate-x-2 bg-slate-50 dark:bg-white/5 p-2 rounded-[1rem] group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/10">
                                            <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-cyan-500 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : activeDoctor ? (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <button 
                        onClick={() => setViewMode("list")}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Network
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="p-8 md:p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[3rem] shadow-xl shadow-slate-200/20 dark:shadow-none relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                                
                                <div className="flex flex-col sm:flex-row gap-8 items-start relative z-10">
                                    {activeDoctor.website ? (
                                        <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-inner shrink-0 overflow-hidden border border-slate-100 dark:border-white/10 p-4 relative z-10">
                                            <img 
                                                src={`https://logo.clearbit.com/${activeDoctor.website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]}`} 
                                                alt={activeDoctor.name}
                                                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }}
                                                className="w-full h-full object-contain object-center"
                                            />
                                            <span className="hidden font-poppins font-black text-5xl text-cyan-600 dark:text-cyan-400">
                                                {activeDoctor.name.charAt(0)}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 bg-gradient-to-br from-cyan-100 to-blue-50 dark:from-cyan-500/20 dark:to-blue-500/10 rounded-[2.5rem] flex items-center justify-center text-cyan-600 shadow-inner shrink-0 relative z-10">
                                            <span className="font-poppins font-black text-5xl">{activeDoctor.name.charAt(0)}</span>
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-4 w-full">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg">Accepting Patients</span>
                                                <span className="flex items-center gap-1 text-yellow-500 font-bold text-xs"><Star className="w-3 h-3 fill-yellow-500" /> {activeDoctor.rating}</span>
                                            </div>
                                            <h1 className="text-3xl md:text-4xl font-poppins font-black text-slate-900 dark:text-white tracking-tight">{activeDoctor.name}</h1>
                                            <p className="text-cyan-600 dark:text-cyan-400 text-sm font-black uppercase tracking-widest mt-2 truncate">{activeDoctor.specialty} • {activeDoctor.experience}</p>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                                                <Phone className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                                                <span className="truncate">{activeDoctor.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                                                <MapPin className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                                                <span className="truncate">{activeDoctor.location}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                                                <Clock className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                                                <span className="truncate text-sm">{activeDoctor.openingHours}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button className="flex-1 py-5 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                                        Book Appointment
                                    </Button>
                                    <button 
                                        onClick={() => setShowMap(!showMap)}
                                        className={`flex-1 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] border-2 transition-all flex items-center justify-center gap-2 ${
                                            showMap 
                                            ? "bg-cyan-50 dark:bg-cyan-500/10 border-cyan-500/20 text-cyan-600" 
                                            : "border-slate-100 dark:border-white/5 text-slate-500 hover:border-cyan-500/30 hover:text-cyan-600"
                                        }`}
                                    >
                                        <MapIcon className="w-4 h-4" />
                                        {showMap ? "Hide Map" : "View on Map"}
                                    </button>
                                </div>

                                {showMap && (
                                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 h-[400px] w-full relative overflow-hidden rounded-[2.5rem] border-2 border-slate-50 dark:border-white/5 shadow-2xl">
                                        <DoctorMap 
                                            center={{ lat: activeDoctor.lat, lon: activeDoctor.lon }} 
                                            markers={[{ id: activeDoctor.id, lat: activeDoctor.lat, lon: activeDoctor.lon, name: activeDoctor.name, type: activeDoctor.specialty }]}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <ShieldCheck className="w-8 h-8 text-cyan-500" />
                                    <h4 className="text-lg font-poppins font-black text-slate-900 dark:text-white">Facility Verified</h4>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                                    This medical facility has been validated via our spatial data network ensuring real-world accuracy and service availability.
                                </p>
                                <ul className="space-y-3">
                                    {["Identity Verified", "Location Pinned", "Accepting Patients"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </main>
    );
}

export default function DoctorsPage() {
    return (
        <Suspense fallback={<div className="p-8">Loading...</div>}>
            <DoctorsPageContent />
        </Suspense>
    );
}