import React, { createContext, useContext, useEffect, useState } from 'react';
import { useIsAuthenticated, useMsal, useAccount } from '@azure/msal-react';
import { supabase } from '../lib/supabase';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [coachProfile, setCoachProfile] = useState<CoachProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { instance } = useMsal();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated || !account?.localAccountId) {
        setUser(null);
        setCoachProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        let { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', account.localAccountId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user:', error);
          setIsLoading(false);
          return;
        }

        if (!data) {
          const newUser = {
            id: account.localAccountId,
            email: account.username || account.name || '',
            display_name: account.name || 'Unbekannt',
            role: 'student',
          };

          const { data: createdUser, error: createError } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .maybeSingle();

          if (createError) {
            console.error('Error creating user:', createError);
            setIsLoading(false);
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

        setIsLoading(false);
      } catch (err) {
        console.error('Error in fetchUserProfile:', err);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, account?.localAccountId]);

  const logout = async () => {
    await instance.logoutPopup();
    setUser(null);
    setCoachProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, coachProfile, isLoading, logout }}>
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
