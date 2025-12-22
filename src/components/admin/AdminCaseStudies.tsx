import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';

interface CaseStudy {
  id: string;
  client: string;
  metric: string;
  label: string;
  description: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

export const AdminCaseStudies = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ 
    client: '', metric: '', label: '', description: '', icon: 'TrendingUp' 
  });

  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ['admin-case-studies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as CaseStudy[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: { client: string; metric: string; label: string; description: string; icon: string }) => {
      const { error } = await supabase.from('case_studies').insert([newItem]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-case-studies'] });
      toast({ title: 'Case study created successfully' });
      setIsAdding(false);
      setFormData({ client: '', metric: '', label: '', description: '', icon: 'TrendingUp' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<CaseStudy> & { id: string }) => {
      const { error } = await supabase.from('case_studies').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-case-studies'] });
      toast({ title: 'Case study updated successfully' });
      setEditingId(null);
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('case_studies').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-case-studies'] });
      toast({ title: 'Case study deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Case Studies</h1>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Case Study
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Case Study</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Client Name"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Metric (e.g., 340%)"
                value={formData.metric}
                onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
              />
              <Input
                placeholder="Label (e.g., ROI Increase)"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </div>
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Input
              placeholder="Icon (e.g., TrendingUp, DollarSign)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={() => createMutation.mutate(formData)}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {caseStudies?.map((study) => (
          <Card key={study.id}>
            <CardContent className="p-6">
              {editingId === study.id ? (
                <div className="space-y-4">
                  <Input
                    defaultValue={study.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      defaultValue={study.metric}
                      onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                    />
                    <Input
                      defaultValue={study.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    />
                  </div>
                  <Textarea
                    defaultValue={study.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => updateMutation.mutate({ id: study.id, ...formData })}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{study.client}</h3>
                    <p className="text-accent text-2xl font-bold mt-1">{study.metric}</p>
                    <p className="text-sm text-muted-foreground">{study.label}</p>
                    <p className="text-muted-foreground mt-2">{study.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(study.id);
                        setFormData({
                          client: study.client,
                          metric: study.metric,
                          label: study.label,
                          description: study.description,
                          icon: study.icon || 'TrendingUp',
                        });
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(study.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
