import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { setPageSeo } from '@/lib/seo';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, Clock } from 'lucide-react';

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[] | null;
}

export default function Careers() {
  useEffect(() => {
    setPageSeo({
      title: 'Careers | Catalyst AI',
      description: 'Join the Catalyst AI team. Explore open positions and help us build the future of AI-powered business growth.',
      canonical: `${window.location.origin}/careers`,
    });
  }, []);

  const { data: careers, isLoading } = useQuery({
    queryKey: ['careers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as Career[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-narrow text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Join Our <span className="text-accent">Team</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto">
            Help us build the future of AI-powered growth. We're looking for passionate individuals 
            who want to make a real impact in the world of business technology.
          </p>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-muted/30">
        <div className="container-narrow">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-12 text-center">Why Join Catalyst AI?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Remote First', description: 'Work from anywhere in the world with flexible hours.' },
              { title: 'Competitive Pay', description: 'Top-tier compensation packages with equity options.' },
              { title: 'Health Benefits', description: 'Comprehensive health, dental, and vision coverage.' },
              { title: 'Learning Budget', description: 'Annual budget for courses, conferences, and growth.' },
            ].map((benefit, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6 text-center">
                <h3 className="font-display text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="container-narrow">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-12 text-center">Open Positions</h2>
          
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : careers && careers.length > 0 ? (
            <div className="space-y-6">
              {careers.map((career) => (
                <div key={career.id} className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold">{career.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {career.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {career.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {career.type}
                        </span>
                      </div>
                    </div>
                    <Button variant="glow" size="sm">
                      Apply Now
                    </Button>
                  </div>
                  <p className="text-muted-foreground mb-4">{career.description}</p>
                  {career.requirements && career.requirements.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {career.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground mb-4">No open positions at the moment.</p>
              <p className="text-sm text-muted-foreground">Check back soon or send us your resume at careers@catalystai.com</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
