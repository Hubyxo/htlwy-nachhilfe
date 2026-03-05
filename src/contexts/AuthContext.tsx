import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { parseClassFromEmail } from '../lib/classParser';
import type { User } from '@supabase/supabase-js';
import type { Department } from '../lib/classParser';

export type { Department };

interface UserProfile {
  id: string;
  class_code?: string | null;
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

interface ParsedUserClass {
  classCode: string;
  schoolYear: string;
  department: Department;
}

interface AuthContextType {
  user: UserProfile | null;
  coachProfile: CoachProfile | null;
  parsedClass: ParsedUserClass | null;
  isLoading: boolean;
  logout: () => void;
const CLASS_CODE_PATTERN = /^[1-5][A-Z]{1,2}(HIT|HMBA|HMBA|HET|HWIM|FME)$/i;

const deriveClassCodeFromMetadata = (metadata: Record<string, unknown>): string | null => {
  const candidates = [
    metadata?.department,
    metadata?.jobTitle,
    metadata?.job_title,
    metadata?.extensionAttribute1,
    metadata?.extension_attribute_1,
    metadata?.onPremisesExtensionAttributes?.extensionAttribute1,
  ];

  for (const val of candidates) {
    if (typeof val === 'string' && CLASS_CODE_PATTERN.test(val.trim())) {
      return val.trim().toUpperCase();
    }
  }

  const allValues = JSON.stringify(metadata);
  const match = allValues.match(/[1-5][A-Z]{1,2}(HIT|HMBA|HET|HWIM|FME)/i);
  if (match) return match[0].toUpperCase();

  return null;
};

  signInWithAzure: () => Promise<void>;
}

const deriveNameFromEmail = (email: string): string => {
  const local = email.split('@')[0];
  return local
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [coachProfile, setCoachProfile] = useState<CoachProfile | null>(null);
  const [parsedClass, setParsedClass] = useState<ParsedUserClass | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async (authUser: User) => {
      try {
        let { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

            class_code: deriveClassCodeFromMetadata(authUser.user_metadata || {}),
        if (error) {
          console.error('Error fetching user:', error);
          return;
        }

        if (!data) {
          const newUser = {
            id: authUser.id,
            email: authUser.email || '',
            display_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || deriveNameFromEmail(authUser.email || ''),
            profile_image_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
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
          const avatarUrl = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null;
          const updates: Record<string, string | null> = {};
          if (avatarUrl && !data.profile_image_url) updates.profile_image_url = avatarUrl;
          if (data.display_name === 'Unbekannt' || !data.display_name) {
            updates.display_name =
              authUser.user_metadata?.full_name ||
              authUser.user_metadata?.name ||
              deriveNameFromEmail(authUser.email || '');
          }
          if (!data.class_code) {
            const derived = deriveClassCodeFromMetadata(authUser.user_metadata || {});
            if (derived) updates.class_code = derived;
          }
          if (Object.keys(updates).length > 0) {
            await supabase.from('users').update(updates).eq('id', data.id);
            data = { ...data, ...updates };
          }
          setUser(data);
          setParsedClass(parseClassFromEmail(data.email));

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
        setParsedClass(null);
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
    setParsedClass(null);
  };

  return (
    <AuthContext.Provider value={{ user, coachProfile, parsedClass, isLoading, logout, signInWithAzure }}>
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
