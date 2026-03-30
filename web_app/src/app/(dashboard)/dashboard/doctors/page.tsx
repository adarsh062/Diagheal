export const dynamic = "force-dynamic";
"use client";
import Button from "@/components/ui/Button";

const DOCTORS = [
    { name: "Dr. Anjali Sharma", spec: "Hepatologist (Liver Specialist)", exp: "12 Years", rating: 4.9, loc: "City Hospital, Bhopal" },
    { name: "Dr. Rajesh Verma", spec: "Gastroenterologist", exp: "15 Years", rating: 4.8, loc: "Apex Clinic, MP Nagar" },
    { name: "Dr. Kavita Singh", spec: "General Physician", exp: "8 Years", rating: 4.7, loc: "HealthCare Plus, Indrapuri" },
];

export default function DoctorsPage() {
    return (
        <main className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-poppins font-semibold text-black mb-2">Find Doctors</h1>
                <p className="text-gray-600 font-barlow">Top rated specialists near you based on your reports.</p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {DOCTORS.map((doc, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-8 shadow-lg hover:shadow-cyan-100 transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-xl">
                                {doc.name.split(" ")[1][0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 font-poppins">{doc.name}</h3>
                                <p className="text-xs text-gray-500 font-barlow uppercase tracking-wide">{doc.spec}</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                {doc.exp} Experience
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                {doc.rating} Rating
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {doc.loc}
                            </div>
                        </div>

                        <Button className="w-full shadow-md text-sm">Book Appointment</Button>
                    </div>
                ))}
            </div>
        </main>
    );
}

