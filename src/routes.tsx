// src/routes.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { SignUpForm } from "./features/auth/SignUp";
import { LoginForm } from "./features/auth/LoginForm";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PostEditor from "./pages/PostEditor";
import KanbanPage from "./pages/Kanban";
import MediaPage from "./pages/Media"; //
import CalendarPage from "./pages/Calendar"; // IMPORTE AQUI

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Rotas Públicas
      { path: "login", element: <LoginForm /> },
      { path: "signup", element: <SignUpForm /> },
      
      // Rotas Protegidas
      {
        element: <ProtectedRoute />,
        children: [
          // Rota de índice para redirecionamento
          // Quando o usuário estiver logado e acessar "/", ele será redirecionado para "/dashboard"
          {
            index: true, // "index: true" marca esta como a rota padrão do pai
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          { 
            path: "dashboard/posts/new", 
            element: <PostEditor />,
          },
          { 
            path: "dashboard/kanban", 
            element: <KanbanPage /> 
          },
          {
            path: "dashboard/media",
            element: <MediaPage />
           },
           { path: "dashboard/calendar",
            element: <CalendarPage />
          },

        ],
      },
    ],
  },
]);