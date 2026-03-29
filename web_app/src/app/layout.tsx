import type { Metadata } from "next";
import { Poppins, Barlow, Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/context/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";

// Font Configuration
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins"
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow"
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-raleway"
});

export const metadata: Metadata = {
  title: "DiagHeal",
  description: "AI Health Analysis",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Dynamic background color handled by ThemeProvider via CSS classes */}
      <body className={`${poppins.variable} ${barlow.variable} ${raleway.variable} antialiased bg-[#f2f2eb] dark:bg-dark-bg dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}