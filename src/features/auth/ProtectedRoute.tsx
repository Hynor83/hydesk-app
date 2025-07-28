// src/features/auth/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  // 1. Enquanto está verificando a sessão, mostramos uma tela de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Carregando...</div>
      </div>
    );
  }

  // 2. Se a verificação terminou e NÃO HÁ sessão, redireciona para o login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se a verificação terminou e HÁ uma sessão, permite o acesso à página
  return <Outlet />;
};