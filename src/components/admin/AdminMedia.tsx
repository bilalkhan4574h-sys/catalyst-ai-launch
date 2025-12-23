import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Trash2, 
  Copy, 
  Image as ImageIcon, 
  Video, 
  FileText,
  Loader2,
  X
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
  metadata: Record<string, any> | null;
}

export function AdminMedia() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  const { data: files, isLoading } = useQuery({
    queryKey: ['media-files'],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from('media').list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;
      return data as MediaFile[];
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error } = await supabase.storage.from('media').upload(fileName, file);
      if (error) throw error;
      return fileName;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-files'] });
      toast({ title: 'File uploaded successfully' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Upload failed', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileName: string) => {
      const { error } = await supabase.storage.from('media').remove([fileName]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-files'] });
      setSelectedFile(null);
      toast({ title: 'File deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Delete failed', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    for (const file of Array.from(selectedFiles)) {
      await uploadMutation.mutateAsync(file);
    }
    setUploading(false);
    e.target.value = '';
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from('media').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: 'URL copied to clipboard' });
  };

  const getFileIcon = (mimetype: string | undefined) => {
    if (mimetype?.startsWith('image/')) return <ImageIcon className="w-8 h-8" />;
    if (mimetype?.startsWith('video/')) return <Video className="w-8 h-8" />;
    return <FileText className="w-8 h-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (mimetype: string | undefined) => mimetype?.startsWith('image/');
  const isVideo = (mimetype: string | undefined) => mimetype?.startsWith('video/');

  if (isLoading) {
    return <div className="text-muted-foreground">Loading media...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Media Library</h2>
          <p className="text-muted-foreground">Upload and manage photos and videos</p>
        </div>
        
        <div>
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? 'Uploading...' : 'Upload Files'}
            </div>
          </Label>
          <Input
            id="file-upload"
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {files?.map((file) => {
          const url = getPublicUrl(file.name);
          const mimetype = file.metadata?.mimetype || '';
          
          return (
            <Card 
              key={file.id} 
              className={`cursor-pointer hover:ring-2 hover:ring-accent transition-all ${
                selectedFile?.id === file.id ? 'ring-2 ring-accent' : ''
              }`}
              onClick={() => setSelectedFile(file)}
            >
              <CardContent className="p-2">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  {isImage(mimetype) ? (
                    <img 
                      src={url} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : isVideo(mimetype) ? (
                    <video 
                      src={url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    getFileIcon(mimetype)
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2 truncate">
                  {file.name}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {files?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No media files yet. Upload some to get started!</p>
          </CardContent>
        </Card>
      )}

      {/* Selected File Details */}
      {selectedFile && (
        <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">File Details</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {isImage(selectedFile.metadata?.mimetype) ? (
                <img 
                  src={getPublicUrl(selectedFile.name)} 
                  alt={selectedFile.name}
                  className="w-full h-full object-contain"
                />
              ) : isVideo(selectedFile.metadata?.mimetype) ? (
                <video 
                  src={getPublicUrl(selectedFile.name)}
                  className="w-full h-full object-contain"
                  controls
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {getFileIcon(selectedFile.metadata?.mimetype)}
                </div>
              )}
            </div>
            
            <div className="text-sm space-y-1">
              <p className="font-medium truncate">{selectedFile.name}</p>
              <p className="text-muted-foreground">
                {formatFileSize(selectedFile.metadata?.size || 0)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => copyToClipboard(getPublicUrl(selectedFile.name))}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy URL
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete file?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the file.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate(selectedFile.name)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
