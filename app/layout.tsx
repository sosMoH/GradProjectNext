import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "Air-M",
  description: "Dashboard for monitoring indoor air quality",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col md:flex-row h-screen w-full bg-[#04070C] overflow-hidden">
        {/* The Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 h-full overflow-y-auto relative pb-[70px] md:pb-0">
          {children}
        </div>
      </body>
    </html>
  );
}