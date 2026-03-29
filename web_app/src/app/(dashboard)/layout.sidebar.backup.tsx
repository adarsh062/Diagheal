import Sidebar from "@/components/layout/Sidebar";
import PageTransition from "@/components/layout/PageTransition";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f2f2eb] dark:bg-dark-bg transition-colors duration-300">
      {/* Sidebar is OUTSIDE PageTransition — it never re-animates on navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden min-w-0">
        {/* Background Blobs — static, never animated */}
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-400 blur-[100px] opacity-20 dark:opacity-10 rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600 blur-[120px] opacity-15 dark:opacity-10 rounded-full pointer-events-none" />

        {/* Only the PAGE CONTENT animates on navigation */}
        <PageTransition>
          {/* pb-24 gives space for mobile bottom nav bar */}
          <div className="relative z-10 p-4 md:p-6 lg:p-8 pb-24 lg:pb-10">
            {children}
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
