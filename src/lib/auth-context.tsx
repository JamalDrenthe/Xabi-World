import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import type { DemoAccount, UserProfile } from '@/types/auth';

export const ADMIN_EMAIL = 'info@jamaldrenthe.com';

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'demo-admin',
    email: 'info@jamaldrenthe.com',
    fullName: 'Jamal Drenthe',
    firstName: 'Jamal',
    lastName: 'Drenthe',
    initials: 'JD',
    role: 'admin',
    membershipTier: 'admin',
    badge: 'Administrator',
    description: 'Volledige beheerderstoegang over het Xabi World platform, Firestore en projectinstellingen.',
    iban: 'NL91 XABI 0001 0000 01',
    phone: '+31 6 1234 56 78',
    dateOfBirth: '1988-03-21',
    address: 'Keizersgracht 321',
    city: 'Amsterdam',
    postalCode: '1017 BZ',
    country: 'Nederland',
    isDemo: true,
  },
  {
    id: 'demo-daan',
    email: 'daan.vermeulen@xabi.world',
    fullName: 'Daan Vermeulen',
    firstName: 'Daan',
    lastName: 'Vermeulen',
    initials: 'DV',
    role: 'user',
    membershipTier: 'basis',
    badge: 'Basis Lid',
    description: 'Standaard particulier account met dagelijkse betaal- en spaarrekening.',
    iban: 'NL82 XABI 0123 4567 89',
    phone: '+31 6 2947 18 35',
    dateOfBirth: '1990-05-14',
    address: 'Herengracht 420',
    city: 'Amsterdam',
    postalCode: '1017 BZ',
    country: 'Nederland',
    isDemo: true,
  },
  {
    id: 'demo-sophie',
    email: 'sophie.vandijk@xabi.world',
    fullName: 'Sophie van Dijk',
    firstName: 'Sophie',
    lastName: 'van Dijk',
    initials: 'SD',
    role: 'user',
    membershipTier: 'premium',
    badge: 'Premium Belegger',
    description: 'Particulier vermogensbeheer met actieve ETF-portfolio en beleggingsdoelen.',
    iban: 'NL55 XABI 4589 1234 77',
    phone: '+31 6 4821 90 12',
    dateOfBirth: '1994-08-27',
    address: 'Oudegracht 154',
    city: 'Utrecht',
    postalCode: '3512 JE',
    country: 'Nederland',
    isDemo: true,
  },
  {
    id: 'demo-lucas',
    email: 'lucas.deboer@xabi.world',
    fullName: 'Lucas de Boer',
    firstName: 'Lucas',
    lastName: 'de Boer',
    initials: 'LB',
    role: 'user',
    membershipTier: 'business',
    badge: 'Zakelijk Ondernemer',
    description: 'Zakelijk account met holdingoverzicht, btw-reserveringen en cashflowinzichten.',
    iban: 'NL33 XABI 9012 3456 99',
    phone: '+31 6 7734 50 88',
    dateOfBirth: '1987-11-03',
    address: 'Witte de Withstraat 45',
    city: 'Rotterdam',
    postalCode: '3011 WN',
    country: 'Nederland',
    isDemo: true,
  },
];

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  authError: string | null;
  demoAccounts: DemoAccount[];
  loginWithGoogle: () => Promise<UserProfile>;
  loginWithDemo: (demoId: string) => UserProfile;
  loginWithEmail: (email: string, name?: string) => UserProfile;
  switchUser: (userIdOrEmail: string) => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'xabi-active-user';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function userFromFirebaseUser(firebaseUser: User): UserProfile {
  const email = (firebaseUser.email || '').toLowerCase();
  const isAdmin = email === ADMIN_EMAIL.toLowerCase();
  const fullName = firebaseUser.displayName || (isAdmin ? 'Jamal Drenthe' : email.split('@')[0]);
  const names = fullName.split(' ');
  const firstName = names[0] || '';
  const lastName = names.slice(1).join(' ') || '';

  return {
    id: firebaseUser.uid,
    email,
    fullName,
    firstName,
    lastName,
    initials: getInitials(fullName),
    role: isAdmin ? 'admin' : 'user',
    membershipTier: isAdmin ? 'admin' : 'basis',
    photoUrl: firebaseUser.photoURL || undefined,
    iban: isAdmin ? 'NL91 XABI 0001 0000 01' : 'NL82 XABI ' + Math.floor(1000 + Math.random() * 9000) + ' 4567 89',
    country: 'Nederland',
    isDemo: false,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Sync with Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const profile = userFromFirebaseUser(firebaseUser);
        setCurrentUser(profile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        localStorage.setItem('xabi-authenticated', 'true');
      } else {
        // If not a demo user, clear out
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (!parsed.isDemo) {
              setCurrentUser(null);
              localStorage.removeItem(STORAGE_KEY);
              localStorage.removeItem('xabi-authenticated');
            }
          } catch {
            // ignore
          }
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveUser = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem('xabi-authenticated', 'true');
    setAuthError(null);
  };

  const loginWithGoogle = async (): Promise<UserProfile> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profile = userFromFirebaseUser(result.user);
      saveUser(profile);
      return profile;
    } catch (error: any) {
      const code = error?.code || '';
      let message = 'Inloggen met Google is mislukt.';
      if (code === 'auth/popup-closed-by-user') {
        message = 'Het Google-inlogvenster is gesloten.';
      } else if (code === 'auth/unauthorized-domain') {
        message = 'Dit domein (xabi.world) moet nog worden toegevoegd aan geautoriseerde domeinen in Firebase Auth.';
      } else if (code === 'auth/operation-not-allowed') {
        message = 'Google Sign-In is nog niet geactiveerd in de Firebase Console.';
      } else if (error?.message) {
        message = error.message;
      }
      setAuthError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithDemo = (demoId: string): UserProfile => {
    const demo = DEMO_ACCOUNTS.find((acc) => acc.id === demoId) || DEMO_ACCOUNTS[0];
    saveUser(demo);
    return demo;
  };

  const loginWithEmail = (email: string, name?: string): UserProfile => {
    const cleanEmail = email.trim().toLowerCase();
    // Check if matches demo admin
    if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
      return loginWithDemo('demo-admin');
    }

    // Check if matches any demo user
    const matchedDemo = DEMO_ACCOUNTS.find((acc) => acc.email.toLowerCase() === cleanEmail);
    if (matchedDemo) {
      saveUser(matchedDemo);
      return matchedDemo;
    }

    // Regular custom user
    const fullName = name?.trim() || cleanEmail.split('@')[0] || 'Gebruiker';
    const names = fullName.split(' ');
    const user: UserProfile = {
      id: 'user-' + Date.now(),
      email: cleanEmail,
      fullName,
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      initials: getInitials(fullName),
      role: 'user',
      membershipTier: 'basis',
      iban: 'NL82 XABI ' + Math.floor(1000 + Math.random() * 9000) + ' 1234 56',
      country: 'Nederland',
      isDemo: true,
    };
    saveUser(user);
    return user;
  };

  const switchUser = (userIdOrEmail: string) => {
    const found = DEMO_ACCOUNTS.find(
      (acc) => acc.id === userIdOrEmail || acc.email.toLowerCase() === userIdOrEmail.toLowerCase()
    );
    if (found) {
      saveUser(found);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('xabi-authenticated');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    saveUser(updated);
  };

  const isAuthenticated = Boolean(currentUser);
  const isAdmin = currentUser?.role === 'admin' || currentUser?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isLoading,
        authError,
        demoAccounts: DEMO_ACCOUNTS,
        loginWithGoogle,
        loginWithDemo,
        loginWithEmail,
        switchUser,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
