// src/pages/Kanban.tsx
import { useAuth } from "../features/auth/AuthProvider";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { DndContext, rectIntersection, type DragEndEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Post = {
  id: number;
  title: string;
  status: string;
  caption: string;
};

const PostCard = ({ post }: { post: Post }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white p-4 rounded-md shadow touch-none">
      <h3 className="font-semibold">{post.title}</h3>
      <p className="text-sm text-gray-600 mt-1 truncate">{post.caption}</p>
    </div>
  );
};

const Column = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="bg-gray-100 rounded-lg p-4 w-1/3">
      <h2 className="font-bold text-lg mb-4">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

const KanbanPage = () => {
  // --- MUDANÇA 1: Pegamos o 'profile' e o 'user' do nosso hook de autenticação ---
  const { profile, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      // --- MUDANÇA 2: Usamos a variável 'user' que pegamos do useAuth() ---
      if (!user) return;
      const { data, error } = await supabase.from('posts').select('*');
      if (error) {
        console.error('Erro ao buscar posts:', error);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [user]); // A dependência [user] garante que a busca roda quando o usuário é definido.

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activePost = posts.find(p => p.id === active.id);
    const originalStatus = activePost?.status;
    const newStatus = over.id as string;

    // --- MUDANÇA 3: A nova lógica de verificação de permissão ---
    if (profile?.role === 'editor' && newStatus === 'aprovado') {
      alert('Apenas Admins ou Revisores podem aprovar um post.');
      return; // Ação bloqueada!
    }
    // ----------------------------------------------------------------

    if (!activePost || originalStatus === newStatus) {
      return;
    }

    setPosts((prevPosts) =>
      prevPosts.map(p => p.id === active.id ? { ...p, status: newStatus } : p)
    );

    const { error } = await supabase
      .from('posts')
      .update({ status: newStatus })
      .eq('id', active.id);

    if (error) {
      console.error("ERRO DETECTADO! A atualização falhou.", error);
      alert('Falha ao atualizar o status do post.');
      setPosts((prevPosts) =>
        prevPosts.map(p => p.id === active.id ? { ...p, status: activePost.status } : p)
      );
    }
  };

  if (loading) {
    return <div className="p-4">Carregando quadro...</div>;
  }
  
  const columns = ['rascunho', 'em_aprovacao', 'aprovado'];
  const columnNames: { [key:string]: string } = {
    rascunho: 'Rascunho',
    em_aprovacao: 'Em Aprovação',
    aprovado: 'Aprovado',
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Kanban de Conteúdo</h1>
      <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
        <div className="flex gap-4">
          {columns.map(status => {
            const postsInColumn = posts.filter(p => p.status === status);
            return (
              <Column key={status} id={status} title={`${columnNames[status]} (${postsInColumn.length})`}>
                <SortableContext items={postsInColumn.map(p => p.id)} strategy={verticalListSortingStrategy}>
                  {postsInColumn.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </SortableContext>
              </Column>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanPage;