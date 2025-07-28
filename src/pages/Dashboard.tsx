// src/pages/Dashboard.tsx
import { supabase } from "../lib/supabase"; // Corrigido para caminho relativo
import { Link } from "react-router-dom"; 

const Dashboard = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Bem-vindo ao Dashboard!</h1>
      <p>Você está logado.</p>

      <div className="flex gap-4">
        <Link to="/dashboard/posts/new">
          <button className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Criar Novo Post
          </button>
        </Link>

        <Link to="/dashboard/media">
            <button className="px-4 py-2 font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-600">
            Ver Mídia
          </button>
        </Link>

        <Link to="/dashboard/calendar">
             <button className="px-4 py-2 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600">
            Ver Calendário
         </button>
        </Link>

        {/* LINK PARA A NOVA PÁGINA KANBAN */}
        <Link to="/dashboard/kanban">
          <button className="px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600">
            Ver Kanban
          </button>
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
      >
        Sair (Logout)
      </button>
    </div>
  );
};

export default Dashboard;