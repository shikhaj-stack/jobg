import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/server";
import Navbar from "@/components/landing/Navbar";
import VoiceAssistant from "@/components/ui/VoiceAssistant";

export default async function DashboardLayout({ children }) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />
      <main className="pt-16">{children}</main>
      {/* Voice assistant — available on every dashboard page */}
      <VoiceAssistant />
    </div>
  );
}