export type UserRole =
  'visitor' | 'user' | 'premium_user' | 'admin' | 'developer';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  expiresAt: string;
};

export type SignInPayload = {
  email: string;
  password: string;
  remember: boolean;
};
