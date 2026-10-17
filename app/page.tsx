import Hero from "@/components/hero";
import ScrollShowcase from "@/components/scroll-showcase";
import ProjectsVault from "@/components/projects-vault";
import SignatureWall from "@/components/signature-wall";
import SectionSeparator from "@/components/section-separator";
import Footer from "@/components/footer";
import ScrollHeartPrompt from "@/components/scroll-heart-prompt";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#FAFAF9] text-black">
      <ScrollHeartPrompt />
      <Hero />
      <SectionSeparator />
      <ScrollShowcase />
      <SectionSeparator />
      <ProjectsVault />
      <SectionSeparator />
      <SignatureWall />
      <SectionSeparator />
      <Footer />
    </main>
  );
}