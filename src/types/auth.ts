export type UserRole = 'admin' | 'user';

export type MembershipTier = 'basis' | 'premium' | 'business' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  initials: string;
  role: UserRole;
  membershipTier: MembershipTier;
  photoUrl?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  iban?: string;
  isDemo?: boolean;
}

export interface DemoAccount extends UserProfile {
  description: string;
  badge: string;
}
