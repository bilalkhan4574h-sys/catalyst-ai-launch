import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Process } from "@/components/sections/Process";
import { TechStack } from "@/components/sections/TechStack";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Services />
        <CaseStudies />
        <Process />
        <TechStack />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
