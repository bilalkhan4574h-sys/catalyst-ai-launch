import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { setPageSeo } from '@/lib/seo';
import { Skeleton } from '@/components/ui/skeleton';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface CaseStudy {
  id: string;
  client: string;
  metric: string;
  label: string;
  description: string;
  icon: string | null;
}

export default function CaseStudiesPage() {
  useEffect(() => {
    setPageSeo({
      title: 'Case Studies | Catalyst AI',
      description: 'See how Catalyst AI has helped businesses achieve remarkable growth with AI-powered solutions.',
      canonical: `${window.location.origin}/case-studies`,
    });
  }, []);

  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ['case-studies-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as CaseStudy[];
    },
  });

  const getIcon = (iconName: string | null): LucideIcon => {
    if (!iconName) return Icons.TrendingUp;
    const icon = (Icons as unknown as Record<string, LucideIcon>)[iconName];
    return icon || Icons.TrendingUp;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-narrow text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Case <span className="text-accent">Studies</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto">
            Discover how we've helped businesses across industries achieve remarkable growth 
            with our AI-powered solutions.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="container-narrow">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-8">
                  <Skeleton className="w-12 h-12 rounded-full mb-4" />
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : caseStudies && caseStudies.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-8">
              {caseStudies.map((study) => {
                const IconComponent = getIcon(study.icon);
                return (
                  <div 
                    key={study.id} 
                    className="bg-card border border-border rounded-xl p-8 hover:border-accent/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                      <IconComponent className="w-6 h-6 text-accent" />
                    </div>
                    <div className="mb-4">
                      <span className="text-4xl font-display font-bold text-accent">{study.metric}</span>
                      <span className="text-muted-foreground ml-2">{study.label}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-3">{study.client}</h3>
                    <p className="text-muted-foreground">{study.description}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground">Case studies coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-muted/30">
        <div className="container-narrow text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Let's discuss how Catalyst AI can help your business achieve similar results.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Get Started Today
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
