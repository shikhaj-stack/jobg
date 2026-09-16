import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata = {
  title: "ParivarLearn — हर परिवार के लिए अंग्रेजी | Learn English for Every Family",
  description: "Free bilingual English learning platform for Indian families. Learn English from basic to advanced — explained in Hindi. Voice tutor, structured roadmap, and curated YouTube videos.",
  keywords: "English learning Hindi, family learning, bilingual platform, English tutor, angrezi sikhein",
  openGraph: {
    title: "ParivarLearn — Learn English with Confidence",
    description: "Free English learning for every Indian family — in Hindi and English.",
    locale: "hi_IN",
    alternateLocale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Fonts: Latin + Devanagari loaded together */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#f8fafc] font-sans text-slate-800 antialiased relative overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 bg-[#f8fafc] bg-grain opacity-60"></div>
        </div>
        <LanguageProvider>
          <AuthProvider>
            <div className="relative z-10 min-h-screen">
              {children}
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}