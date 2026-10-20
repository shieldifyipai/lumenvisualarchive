import { supabase, isSupabaseConfigured } from './supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  isDemo?: boolean;
}

const DEMO_SESSION_KEY = 'lumina_admin_auth_session';

export const authService = {
  isSupabaseEnabled(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  async getCurrentUser(): Promise<AdminUser | null> {
    if (this.isSupabaseEnabled()) {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        if (session?.user) {
          return {
            id: session.user.id,
            email: session.user.email || 'admin@portfolio.local',
            role: 'admin',
          };
        }
      } catch (err) {
        console.warn('Error checking Supabase auth session:', err);
      }
    }

    // Local / Demo mode session check
    if (typeof window !== 'undefined') {
      try {
        const demoSession = sessionStorage.getItem(DEMO_SESSION_KEY);
        if (demoSession) {
          const parsed = JSON.parse(demoSession);
          return parsed;
        }
      } catch {
        // ignore
      }
    }

    return null;
  },

  async login(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    if (this.isSupabaseEnabled()) {
      try {
        const { data, error } = await supabase!.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const user: AdminUser = {
            id: data.user.id,
            email: data.user.email || email,
            role: 'admin',
          };
          return { success: true, user };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Supabase authentication error' };
      }
    }

    // When Supabase is not configured yet, allow the reviewer/admin to create/sign in with their credentials
    if (!email || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const demoUser: AdminUser = {
      id: `admin-${Date.now()}`,
      email,
      role: 'admin',
      isDemo: true,
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser));
    }

    return { success: true, user: demoUser };
  },

  async logout(): Promise<void> {
    if (this.isSupabaseEnabled()) {
      try {
        await supabase!.auth.signOut();
      } catch {
        // ignore
      }
    }

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(DEMO_SESSION_KEY);
    }
  },
};
