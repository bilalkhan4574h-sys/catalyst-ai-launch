import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Contact as ContactSection } from "@/components/sections/Contact";
import { setPageSeo } from "@/lib/seo";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  useEffect(() => {
    setPageSeo({
      title: "Contact Us | Catalyst AI",
      description:
        "Get in touch with Catalyst AI. We'd love to hear from you and discuss how we can help grow your business.",
      canonical: `${window.location.origin}/contact`,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-narrow text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Get in <span className="text-accent">Touch</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto">
            Have a question or want to learn more about how Catalyst AI can help your business? We'd love to hear from
            you.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="container-narrow">
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display font-semibold mb-2">Email Us</h3>
              <p className="text-muted-foreground text-sm">coming soon</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display font-semibold mb-2">Call Us</h3>
              <p className="text-muted-foreground text-sm">+92 3415100757</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display font-semibold mb-2">Visit Us</h3>
              <p className="text-muted-foreground text-sm">Islamabad, Pakistan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactSection />

      <Footer />
    </div>
  );
}
