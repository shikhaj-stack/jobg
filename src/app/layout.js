import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "JOBG // Ultimate MAANG & Web3 Job Readiness Platform",
  description: "Bridging the gap between unstructured content and top-tier employment. Curated roadmaps, real-time live tech theater, and AI-powered job readiness.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-[#f8fafc] text-slate-900 selection:bg-amber-500/20 selection:text-amber-900">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#f8fafc] font-sans text-slate-800 antialiased relative overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 bg-[#f8fafc] bg-grain opacity-60"></div>
        </div>
        <AuthProvider>
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
