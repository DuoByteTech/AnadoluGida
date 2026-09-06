import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase/client";

import {
  getProfileByUserId,
  signInWithEmail,
  signOut as signOutService,
} from "../services/auth.service";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      return null;
    }

    const profileData = await getProfileByUserId(currentUser.id);

    setProfile(profileData);

    return profileData;
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!mounted) {
          return;
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await loadProfile(currentSession.user);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);

        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (!currentSession?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        await loadProfile(currentSession.user);
      } catch (error) {
        console.error("Profile loading error:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const login = useCallback(async (email, password) => {
    const data = await signInWithEmail(email, password);

    if (!data.user) {
      throw new Error("USER_NOT_FOUND");
    }

    const profileData = await getProfileByUserId(data.user.id);

    if (!profileData.is_active) {
      await signOutService();
      throw new Error("ACCOUNT_DISABLED");
    }

    if (profileData.role !== "admin") {
      await signOutService();
      throw new Error("ADMIN_REQUIRED");
    }

    setSession(data.session);
    setUser(data.user);
    setProfile(profileData);

    return {
      user: data.user,
      profile: profileData,
    };
  }, []);

  const logout = useCallback(async () => {
    await signOutService();

    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      loading,

      isAuthenticated: Boolean(user),

      isAdmin: profile?.role === "admin" && profile?.is_active === true,

      login,
      logout,
    }),
    [session, user, profile, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
