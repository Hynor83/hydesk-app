// src/App.tsx
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner"; // Importamos o componente de notificação

function App() {
  return (
    <div>
      {/* O Outlet renderiza a página atual (Login, Dashboard, etc.) */}
      <Outlet />

      {/* O Toaster fica aqui, "escutando" em todas as páginas */}
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;