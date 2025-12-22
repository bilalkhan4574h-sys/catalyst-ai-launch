import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MessageSquare, Briefcase, Users } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [services, caseStudies, blogPosts, contacts] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact' }),
        supabase.from('case_studies').select('id', { count: 'exact' }),
        supabase.from('blog_posts').select('id', { count: 'exact' }),
        supabase.from('contact_submissions').select('id', { count: 'exact' }).eq('status', 'new'),
      ]);

      return {
        services: services.count || 0,
        caseStudies: caseStudies.count || 0,
        blogPosts: blogPosts.count || 0,
        newContacts: contacts.count || 0,
      };
    },
  });

  const statCards = [
    { title: 'Services', value: stats?.services || 0, icon: Briefcase, color: 'text-blue-500' },
    { title: 'Case Studies', value: stats?.caseStudies || 0, icon: Users, color: 'text-green-500' },
    { title: 'Blog Posts', value: stats?.blogPosts || 0, icon: FileText, color: 'text-purple-500' },
    { title: 'New Contacts', value: stats?.newContacts || 0, icon: MessageSquare, color: 'text-orange-500' },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to the Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Use the sidebar to manage your website content. You can add, edit, and delete services, case studies, testimonials, blog posts, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
