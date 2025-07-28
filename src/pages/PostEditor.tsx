// src/pages/PostEditor.tsx
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea"; // CAMINHO CORRIGIDO
import { supabase } from "../lib/supabase";
import { useAuth } from "../features/auth/AuthProvider";
import { useState } from "react";
import { MediaLibraryModal } from "../features/media/MediaLibraryModal";
// O import do 'Navigate' foi removido pois não era usado

const PostEditor = () => {
  const { session } = useAuth();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePost = async () => {
    if (!session?.user) return;
    setIsSaving(true);
    const { error } = await supabase.from('posts').insert({
      title: title,
      caption: caption,
      media_url: mediaUrl,
      user_id: session.user.id,
    });
    setIsSaving(false);

    if (error) {
      alert('Erro ao salvar o post: ' + error.message);
    } else {
      alert('Post salvo como rascunho!');
      setTitle('');
      setCaption('');
      setMediaUrl(null);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Criar Novo Post</h1>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">Legenda</label>
            <Textarea id="caption" className="min-h-[200px]" value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Mídia</h3>
          <div className="aspect-square w-full bg-gray-100 rounded-md flex items-center justify-center">
            {mediaUrl ? (
              <img src={mediaUrl} alt="Preview" className="w-full h-full object-contain rounded-md" />
            ) : (
              <span className="text-gray-500">Nenhuma mídia selecionada</span>
            )}
          </div>
          <MediaLibraryModal onSelectMedia={setMediaUrl}>
            <Button variant="outline" className="w-full">
              {mediaUrl ? 'Trocar Mídia' : 'Selecionar da Galeria'}
            </Button>
          </MediaLibraryModal>
          <Button onClick={handleSavePost} disabled={isSaving} className="w-full">
            {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;