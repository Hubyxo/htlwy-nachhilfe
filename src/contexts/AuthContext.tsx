import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  profile_image_url?: string;
  role: 'student' | 'coach';
}

interface CoachProfile {
  id: string;
  user_id: string;
  department: string;
  class: string;
  subjects: string[];
  availability: string;
  additional_info?: string;
  rating?: number;
  completed_bookings: number;
}

interface AuthContextType {
  user: UserProfile | null;
  coachProfile: CoachProfile | null;
  isLoading: boolean;
  logout: () => void;
  signInWithAzure: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [coachProfile, setCoachProfile] = useState<CoachProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async (authUser: User) => {
      try {
        let { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user:', error);
          return;
        }

        if (!data) {
          const newUser = {
            id: authUser.id,
            email: authUser.email || '',
            display_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Unbekannt',
            role: 'student' as const,
          };

          const { data: createdUser, error: createError } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .maybeSingle();

          if (createError) {
            console.error('Error creating user:', createError);
            return;
          }

          data = createdUser;
        }

        if (data) {
          setUser(data);

          if (data.role === 'coach') {
            const { data: coach, error: coachError } = await supabase
              .from('coach_profiles')
              .select('*')
              .eq('user_id', data.id)
              .maybeSingle();

            if (!coachError && coach) {
              setCoachProfile(coach);
            }
          }
        }
      } catch (err) {
        console.error('Error in fetchUserProfile:', err);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setUser(null);
        setCoachProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithAzure = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email',
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('Error signing in with Azure:', error);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCoachProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, coachProfile, isLoading, logout, signInWithAzure }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
