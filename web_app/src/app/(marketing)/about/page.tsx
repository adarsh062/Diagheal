export default function AboutPage() {
    return (
        <main className="pt-32 pb-12 px-6 max-w-7xl mx-auto min-h-screen">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-poppins font-bold text-black mb-6">Revolutionizing Healthcare with AI</h1>
                <p className="text-gray-600 font-barlow text-lg max-w-3xl mx-auto leading-relaxed">
                    DiagHeal is an advanced AI-powered platform designed to assist in the early detection and analysis of organ health through medical reports.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-20">
                <div className="bg-white/60 backdrop-blur-md border border-white/80 p-8 rounded-[2rem] text-center shadow-sm">
                    <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 text-cyan-600 text-2xl font-bold">1</div>
                    <h3 className="text-xl font-bold font-poppins mb-3">Upload Report</h3>
                    <p className="text-gray-500 text-sm">Simply upload your PDF or image based medical reports securely.</p>
                </div>
                <div className="bg-white/60 backdrop-blur-md border border-white/80 p-8 rounded-[2rem] text-center shadow-sm">
                    <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 text-cyan-600 text-2xl font-bold">2</div>
                    <h3 className="text-xl font-bold font-poppins mb-3">AI Analysis</h3>
                    <p className="text-gray-500 text-sm">Our advanced ML models analyze valid parameters and biomarkers.</p>
                </div>
                <div className="bg-white/60 backdrop-blur-md border border-white/80 p-8 rounded-[2rem] text-center shadow-sm">
                    <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 text-cyan-600 text-2xl font-bold">3</div>
                    <h3 className="text-xl font-bold font-poppins mb-3">Get Results</h3>
                    <p className="text-gray-500 text-sm">Receive a comprehensive health analysis and risk assessment.</p>
                </div>
            </div>

            <div className="bg-cyan-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">Our Mission</h2>
                    <p className="text-cyan-100 max-w-2xl mx-auto text-lg leading-relaxed">
                        To make early diagnosis accessible to everyone. By leveraging the power of Artificial Intelligence, we aim to reduce the time between symptom and diagnosis.
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/grid.svg')] opacity-10"></div>
            </div>
        </main>
    );
}
