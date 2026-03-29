export default function StatsCard() {
  return (
    <div className="relative z-20 max-w-2xl mx-auto px-4 mt-12 pointer-events-none pb-10">
      <div className="pointer-events-auto bg-gradient-to-r from-[#2384C1] to-[#3EBDB8] backdrop-blur-md rounded-3xl p-6 md:px-12 md:py-8 max-w-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 text-white font-raleway">
        <div className="text-center md:text-center">
          <h3 className="text-2xl font-semibold">AI-Based</h3>
          <p className="text-sm opacity-90">Analysis</p>
        </div>
        <div className="hidden md:block w-[1px] h-10 bg-white/40"></div>
        <div className="text-center md:text-center">
          <h3 className="text-2xl font-semibold">Secure</h3>
          <p className="text-sm opacity-90">Health Records</p>
        </div>
        <div className="hidden md:block w-[1px] h-10 bg-white/40"></div>
        <div className="text-center md:text-center">
          <h3 className="text-2xl font-semibold">24/7</h3>
          <p className="text-sm opacity-90">Access</p>
        </div>
      </div>
    </div>
  );
}