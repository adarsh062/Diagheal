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
    const [cityQuery, setCityQuery] = useState("Bhopal");
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
        geocodeCity(cityQuery);
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
            {/* full same JSX as tumhara */}
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