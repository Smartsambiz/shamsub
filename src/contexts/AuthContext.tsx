import { createContext, useContext, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { userService, RegisterUserData, LoginUserData } from '../services/userService';

export const useFrontendAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user profile if logged in
        if (session?.user) {
          const profileResult = await userService.getUserProfile(session.user.id);
          if (profileResult.success) {
            setUserProfile(profileResult.profile);
          }
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (userData: RegisterUserData) => {
    setLoading(true);
    const result = await userService.registerUser(userData);
    setLoading(false);
    return result;
  };

  const login = async (loginData: LoginUserData) => {
    setLoading(true);
    const result = await userService.loginUser(loginData);
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    const result = await userService.logoutUser();
    setLoading(false);
    return result;
  };

  return {
    user,
    session,
    userProfile,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };
};

const AuthContext = createContext<ReturnType<typeof useFrontendAuth> | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useFrontendAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
