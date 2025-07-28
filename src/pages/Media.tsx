// src/pages/Media.tsx
import { useAuth } from "../features/auth/AuthProvider";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import type { FileObject } from '@supabase/storage-js';

const MediaPage = () => {
  const { user } = useAuth().session || {};
  const [files, setFiles] = useState<FileObject[]>([]);
  const [uploading, setUploading] = useState(false);

  // Função para buscar os arquivos do usuário no bucket
  const fetchFiles = async () => {
    if (!user) return;

    const { data, error } = await supabase.storage.from('media').list(user.id, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      console.error('Erro ao listar arquivos:', error);
    } else if (data) {
      setFiles(data);
    }
  };

  // Busca os arquivos quando a página carrega
  useEffect(() => {
    fetchFiles();
  }, []);

  // Função para lidar com o upload de um novo arquivo
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }

    const file = event.target.files[0];
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${user.id}/${fileName}`; // Organiza os arquivos em pastas por user_id

    setUploading(true);
    const { error } = await supabase.storage.from('media').upload(filePath, file);
    setUploading(false);

    if (error) {
      alert('Erro no upload: ' + error.message);
    } else {
      alert('Upload concluído!');
      fetchFiles(); // Atualiza a lista de arquivos
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestão de Mídia</h1>

      <div className="mb-6">
        <label htmlFor="media-upload" className="block text-lg font-medium text-gray-700 mb-2">
          Fazer novo upload
        </label>
        <input 
          id="media-upload"
          type="file"
          accept="image/*,video/*"
          onChange={handleUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploading && <p className="mt-2 text-sm text-gray-500">Enviando...</p>}
      </div>

      <h2 className="text-2xl font-bold mb-4">Sua Galeria</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map(file => {
          // Pega a URL pública do arquivo para poder exibi-lo
          const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(`${user!.id}/${file.name}`);

          return (
            <div key={file.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img src={publicUrl} alt={file.name} className="w-full h-full object-cover" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MediaPage;