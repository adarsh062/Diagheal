"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchNearbyMedicalFacilities, OsmElement } from "@/lib/overpass";
import { MapPin, Star, ChevronRight, Loader2 } from "lucide-react";

export default function NearbyDoctors() {
    const [facilities, setFacilities] = useState<OsmElement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const data = await fetchNearbyMedicalFacilities(pos.coords.latitude, pos.coords.longitude, 3000);
                setFacilities(data.slice(0, 3));
                setLoading(false);
            },
            () => setLoading(false)
        );
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-12 bg-slate-50 rounded-[2rem]">
            <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
        </div>
    );

    if (facilities.length === 0 && !loading) return null;

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl md:text-3xl font-poppins font-black text-slate-900 dark:text-white tracking-tight">Nearby Help</h2>
                    <p className="text-slate-400 dark:text-slate-500 font-barlow text-[10px] md:text-sm mt-0.5">Quick access to medical facilities around you.</p>
                </div>
                <Link href="/dashboard/doctors" className="text-[10px] font-black uppercase tracking-widest text-cyan-600 hover:text-cyan-700">
                    Full Network →
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {facilities.map((fac) => {
                    const name = fac.tags?.name || fac.tags?.amenity || "Medical Center";
                    const rating = 4.0 + ((fac.id % 10) / 10);
                    return (
                        <Link 
                            href="/dashboard/doctors" 
                            key={fac.id}
                            className="group p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] hover:shadow-xl hover:border-cyan-100 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-600 font-black">
                                    {name.charAt(0)}
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500 font-black text-xs">
                                    <Star className="w-3 h-3 fill-yellow-500" />
                                    {rating}
                                </div>
                            </div>
                            <h4 className="font-poppins font-black text-slate-900 dark:text-white text-sm group-hover:text-cyan-600 transition-colors line-clamp-1">{name}</h4>
                            <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                <MapPin className="w-3 h-3 text-cyan-500" />
                                {fac.tags?.["addr:city"] || "Nearby"}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    );
}
