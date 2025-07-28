// src/features/auth/AuthProvider.tsx
import type { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Usando caminho relativo

// Perfil que vem da nossa tabela 'profiles'
type Profile = {
  id: string;
  full_name: string;
  role: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null; // Adicionamos o perfil aqui
  loading: boolean;
};

// Criamos o contexto com os valores iniciais
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
});

// Criamos o componente Provedor
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar os dados da sessão e do perfil
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Se há um usuário logado, buscamos o perfil dele
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(userProfile);
      }
      setLoading(false);
    };

    fetchSessionAndProfile();

    // Escuta por mudanças na autenticação (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(userProfile);
        } else {
          setProfile(null); // Limpa o perfil no logout
        }
      }
    );

    // Limpa a assinatura quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, []);

  const value = { session, user, profile, loading };

  // Só renderiza o app depois de carregar os dados iniciais
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook para usar os dados de autenticação em qualquer lugar do app
export const useAuth = () => {
  return useContext(AuthContext);
};