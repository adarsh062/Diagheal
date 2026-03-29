export default function ContactPage() {
    return (
        <main className="pt-32 pb-12 px-6 max-w-7xl mx-auto min-h-screen">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-poppins font-bold text-black mb-4">Get in Touch</h1>
                <p className="text-gray-600 font-barlow text-lg max-w-2xl mx-auto">
                    Have questions about our AI diagnosis? We are here to help you.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-8 md:p-12 shadow-lg">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 font-barlow uppercase tracking-wider">Name</label>
                            <input type="text" className="w-full px-6 py-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 font-barlow uppercase tracking-wider">Email</label>
                            <input type="email" className="w-full px-6 py-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 font-barlow uppercase tracking-wider">Message</label>
                            <textarea rows={4} className="w-full px-6 py-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" placeholder="How can we help?" />
                        </div>
                        <button type="button" className="w-full py-4 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition shadow-lg shadow-cyan-200/50">
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Info Section */}
                <div className="flex flex-col justify-center space-y-8">
                    <div className="bg-white/40 border border-white/60 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold font-poppins mb-2">Email Us</h3>
                        <p className="text-cyan-700 font-medium">support@diagheal.com</p>
                    </div>
                    <div className="bg-white/40 border border-white/60 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold font-poppins mb-2">Location</h3>
                        <p className="text-gray-600">IIIT Bhopal, India</p>
                    </div>
                    <div className="bg-white/40 border border-white/60 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold font-poppins mb-2">Socials</h3>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-cyan-600 transition">Twitter</a>
                            <a href="#" className="text-gray-400 hover:text-cyan-600 transition">LinkedIn</a>
                            <a href="#" className="text-gray-400 hover:text-cyan-600 transition">GitHub</a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
