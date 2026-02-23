import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getOrganizerProfile } from "@/lib/organizer-profile-api";

type AppRole = "athlete" | "organizer" | "admin";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  profileAvatarUrl: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  profileAvatarUrl: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (userId: string) => {
    const { data } = await supabase.rpc("get_user_role", { _user_id: userId });
    setRole((data as AppRole) ?? null);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const profile = await getOrganizerProfile(userId);
      if (profile) {
        setProfileAvatarUrl(profile.avatar_url || null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Silently fail as this shouldn't block the auth flow
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Use setTimeout to avoid Supabase client deadlock
          setTimeout(() => fetchRole(session.user.id), 0);
          fetchProfile(session.user.id); // Fetch profile for avatar
        } else {
          setRole(null);
          setProfileAvatarUrl(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
        fetchProfile(session.user.id); // Fetch profile for avatar
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setProfileAvatarUrl(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, role, profileAvatarUrl, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
