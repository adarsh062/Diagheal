"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet + Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
    lat: number;
    lon: number;
}

interface DoctorMapProps {
    center: Location;
    markers: Array<{
        id: number;
        lat: number;
        lon: number;
        name: string;
        type: string;
    }>;
    onMarkerClick?: (id: number) => void;
}

function ChangeView({ center }: { center: Location }) {
    const map = useMap();
    useEffect(() => {
        if (center.lat && center.lon) {
            map.setView([center.lat, center.lon], 14, { animate: true });
        }
    }, [center, map]);
    return null;
}

export default function DoctorMap({ center, markers, onMarkerClick }: DoctorMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-full w-full bg-slate-100 animate-pulse rounded-3xl" />;

    return (
        <div className="h-full w-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-gray-100 z-10 relative">
            <MapContainer
                center={[center.lat, center.lon]}
                zoom={14}
                scrollWheelZoom={true}
                className="h-full w-full marker-cluster-small"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="bottomright" />
                <ChangeView center={center} />
                
                {/* User Current Location Marker */}
                <Marker position={[center.lat, center.lon]} icon={L.divIcon({
                    className: "user-location-marker",
                    html: '<div class="w-4 h-4 bg-cyan-500 rounded-full border-2 border-white shadow-lg animate-pulse ring-4 ring-cyan-500/30"></div>',
                    iconSize: [16, 16],
                })}>
                    <Popup>You are here</Popup>
                </Marker>

                {markers.map((m) => (
                    <Marker 
                        key={m.id} 
                        position={[m.lat, m.lon]}
                        eventHandlers={{
                            click: () => onMarkerClick?.(m.id),
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2 min-w-[150px]">
                                <h3 className="font-bold text-slate-800 text-sm mb-0.5">{m.name}</h3>
                                <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider">{m.type}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
