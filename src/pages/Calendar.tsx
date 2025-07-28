// src/pages/Calendar.tsx
import { useEffect, useState } from "react";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Estilos padrão do DayPicker
import { supabase } from "../lib/supabase";
import { useAuth } from "../features/auth/AuthProvider";
import { format } from 'date-fns';

type Post = {
  id: number;
  title: string;
  scheduled_at: string;
};

export default function CalendarPage() {
  const { user } = useAuth().session || {};
  const [scheduledDates, setScheduledDates] = useState<Date[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchScheduledPosts = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, scheduled_at')
        .not('scheduled_at', 'is', null);

      if (error) {
        console.error("Erro ao buscar posts agendados:", error);
        return;
      }
      
      if (data) {
        setPosts(data);
        const dates = data.map(post => new Date(post.scheduled_at));
        setScheduledDates(dates);
      }
    };
    fetchScheduledPosts();
  }, [user]);

  // Componente customizado para renderizar o rodapé de cada dia
  const footer = (
    <div className="mt-4 p-4 border-t">
      <h3 className="font-bold mb-2">Posts Agendados</h3>
      <ul className="list-disc list-inside">
        {posts.map(post => (
          <li key={post.id}>
            <strong>{format(new Date(post.scheduled_at), 'dd/MM HH:mm')}</strong> - {post.title}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Calendário Editorial</h1>
      <DayPicker
        mode="multiple"
        selected={scheduledDates}
        className="border rounded-md p-4"
        footer={footer}
      />
    </div>
  );
}