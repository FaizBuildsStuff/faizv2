import HeroBackground from "@/components/hero-background";
import MainFirstPage from "@/components/main";

export default function Home() {
  return (
    // relative containers bind everything together, min-h-screen guarantees viewport spanning
    <main className="relative min-h-screen w-full bg-[#111112]">
      {/* Structural Background Canvas Layer */}
      <HeroBackground />
      
      {/* Floating Interactive Glass UI Layer */}
      <MainFirstPage />
    </main>
  );
}