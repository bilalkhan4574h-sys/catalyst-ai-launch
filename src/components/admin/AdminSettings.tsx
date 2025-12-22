import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

interface SiteSetting {
  id: string;
  key: string;
  value: Record<string, any>;
}

const defaultSettings = {
  hero: {
    title: "AI-Powered Growth for Modern Businesses",
    subtitle: "We build intelligent automation systems that generate leads, nurture prospects, and close deals — while you focus on what matters.",
    ctaText: "Book a Strategy Call",
  },
  contact: {
    email: "hello@catalyst-ai.com",
    location: "San Francisco, CA",
  },
  social: {
    twitter: "",
    linkedin: "",
    github: "",
  },
};

export const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState(defaultSettings);

  const { isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      
      const settingsMap: Record<string, any> = {};
      data?.forEach((setting) => {
        settingsMap[setting.key] = setting.value as Record<string, any>;
      });
      
      setSettings({
        hero: settingsMap.hero || defaultSettings.hero,
        contact: settingsMap.contact || defaultSettings.contact,
        social: settingsMap.social || defaultSettings.social,
      });
      
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      for (const [key, value] of Object.entries(newSettings)) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key, value }, { onConflict: 'key' });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast({ title: 'Settings saved successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Site Settings</h1>
        <Button onClick={() => saveMutation.mutate(settings)}>
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Customize the main hero section on the homepage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={settings.hero.title}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, title: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <Textarea
                value={settings.hero.subtitle}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, subtitle: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CTA Button Text</label>
              <Input
                value={settings.hero.ctaText}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, ctaText: e.target.value }
                })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Your business contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                value={settings.contact.email}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, email: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={settings.contact.location}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, location: e.target.value }
                })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Twitter/X</label>
              <Input
                placeholder="https://twitter.com/yourhandle"
                value={settings.social.twitter}
                onChange={(e) => setSettings({
                  ...settings,
                  social: { ...settings.social, twitter: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <Input
                placeholder="https://linkedin.com/company/yourcompany"
                value={settings.social.linkedin}
                onChange={(e) => setSettings({
                  ...settings,
                  social: { ...settings.social, linkedin: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">GitHub</label>
              <Input
                placeholder="https://github.com/yourorg"
                value={settings.social.github}
                onChange={(e) => setSettings({
                  ...settings,
                  social: { ...settings.social, github: e.target.value }
                })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
