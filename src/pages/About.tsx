import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { setPageSeo } from '@/lib/seo';
import { Skeleton } from '@/components/ui/skeleton';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  github_url: string | null;
}

export default function About() {
  useEffect(() => {
    setPageSeo({
      title: 'About Us | Catalyst AI',
      description: 'Learn about Catalyst AI - Building intelligent growth engines for modern businesses with AI-powered systems that scale.',
      canonical: `${window.location.origin}/about`,
    });
  }, []);

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-narrow text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            About <span className="text-accent">Catalyst AI</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto">
            We're on a mission to democratize AI-powered growth for businesses of all sizes. 
            Our team combines deep expertise in artificial intelligence with decades of marketing experience.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                At Catalyst AI, we believe that every business deserves access to cutting-edge AI technology 
                that can transform their growth trajectory. We build intelligent systems that learn, adapt, 
                and scale with your business.
              </p>
              <p className="text-muted-foreground">
                Our platform combines the latest advances in machine learning with practical business 
                applications, delivering measurable results that drive revenue and reduce costs.
              </p>
            </div>
            <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-display font-bold text-accent mb-2">AI</div>
                <div className="text-muted-foreground">Powered Growth</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-muted/30">
        <div className="container-narrow">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Innovation First', description: 'We push the boundaries of what\'s possible with AI technology.' },
              { title: 'Results Driven', description: 'Every solution we build is measured by tangible business outcomes.' },
              { title: 'Customer Obsessed', description: 'Your success is our success. We\'re partners in your growth journey.' },
              { title: 'Transparency', description: 'We believe in open communication and honest partnerships.' },
              { title: 'Continuous Learning', description: 'Our AI systems and team are always evolving and improving.' },
              { title: 'Ethical AI', description: 'We build responsible AI that respects privacy and promotes fairness.' },
            ].map((value, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-display text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="container-narrow">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-12 text-center">Our Team</h2>
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                  <Skeleton className="w-full aspect-[3/4]" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : teamMembers && teamMembers.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-card border border-border rounded-xl overflow-hidden group hover:shadow-lg transition-shadow duration-300 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)] max-w-[280px]">
                  <div className="w-full aspect-[3/4] bg-gradient-to-br from-accent to-primary flex items-center justify-center overflow-hidden">
                    {member.photo_url ? (
                      <img 
                        src={member.photo_url} 
                        alt={member.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <span className="text-6xl font-bold text-primary-foreground">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-display text-xl font-semibold">{member.name}</h3>
                    <p className="text-accent text-sm mb-2">{member.role}</p>
                    {member.bio && <p className="text-muted-foreground text-sm line-clamp-3">{member.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">Team information coming soon.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
