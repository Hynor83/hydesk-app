// src/features/media/MediaLibraryModal.tsx
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import type { FileObject } from '@supabase/storage-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"; // CAMINHO CORRIGIDO

type MediaLibraryModalProps = {
  onSelectMedia: (url: string) => void;
  children: React.ReactNode;
};

export const MediaLibraryModal = ({ onSelectMedia, children }: MediaLibraryModalProps) => {
  const { user } = useAuth().session || {};
  const [files, setFiles] = useState<FileObject[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchFiles = async () => {
      const { data } = await supabase.storage.from('media').list(user.id, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (data) setFiles(data);
    };

    fetchFiles();
  }, [user]);

  const handleImageSelect = (file: FileObject) => {
    const { data } = supabase.storage.from('media').getPublicUrl(`${user!.id}/${file.name}`);
    onSelectMedia(data.publicUrl);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Selecione uma Mídia</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-h-[60vh] overflow-y-auto p-4">
          {files.map(file => (
            <div 
              key={file.id} 
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500"
              onClick={() => handleImageSelect(file)}
            >
              <img 
                src={supabase.storage.from('media').getPublicUrl(`${user!.id}/${file.name}`).data.publicUrl} 
                alt={file.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};