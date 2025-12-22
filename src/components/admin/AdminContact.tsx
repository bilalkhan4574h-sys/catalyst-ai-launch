import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

export const AdminContact = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ContactSubmission[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      toast({ title: 'Status updated' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default" className="bg-blue-500"><Clock className="w-3 h-3 mr-1" />New</Badge>;
      case 'read':
        return <Badge variant="secondary"><Mail className="w-3 h-3 mr-1" />Read</Badge>;
      case 'replied':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Replied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Contact Submissions</h1>
        <div className="text-sm text-muted-foreground">
          {submissions?.filter(s => s.status === 'new').length || 0} new messages
        </div>
      </div>

      <div className="space-y-4">
        {submissions?.map((submission) => (
          <Card key={submission.id} className={submission.status === 'new' ? 'border-accent/50' : ''}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(submission.status || 'new')}
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(submission.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{submission.name}</h3>
                  <a href={`mailto:${submission.email}`} className="text-accent hover:underline text-sm">
                    {submission.email}
                  </a>
                </div>
                <div className="flex gap-2">
                  {submission.status === 'new' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatusMutation.mutate({ id: submission.id, status: 'read' })}
                    >
                      Mark as Read
                    </Button>
                  )}
                  {submission.status !== 'replied' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatusMutation.mutate({ id: submission.id, status: 'replied' })}
                    >
                      Mark as Replied
                    </Button>
                  )}
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="whitespace-pre-wrap">{submission.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {submissions?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No contact submissions yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
