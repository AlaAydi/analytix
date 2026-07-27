import { Injectable } from '@angular/core';

export interface AuthUser {
  name: string;
  email: string;
  role: 'Administrateur' | 'Client';
  company?: string;
  location?: string;
  bio?: string;
  timezone?: string;
}

interface StoredCredentials {
  name: string;
  email: string;
  password: string;
  role: 'Administrateur' | 'Client';
  company?: string;
  location?: string;
  bio?: string;
  timezone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userKey = 'analytic-dashboard-user';
  private readonly sessionKey = 'analytic-dashboard-session';

  private readonly demoAccount: StoredCredentials = {
    name: 'Aydi Ala',
    email: 'demo@analytix.app',
    password: 'Analytix123!',
    role: 'Administrateur'
  };

  get currentUser(): AuthUser | null {
    const session = localStorage.getItem(this.sessionKey);
    if (!session) {
      return null;
    }

    try {
      return JSON.parse(session) as AuthUser;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  register(
    name: string,
    email: string,
    password: string,
    role: 'Administrateur' | 'Client'
  ): AuthUser {
    const normalizedEmail = email.trim().toLowerCase();
    const user: StoredCredentials = {
      name: name.trim(),
      email: normalizedEmail,
      password,
      role
    };

    localStorage.setItem(this.userKey, JSON.stringify(user));
    return this.setSession(user);
  }

  login(
    email: string,
    password: string,
    role?: 'Administrateur' | 'Client'
  ): AuthUser | null {
    const normalizedEmail = email.trim().toLowerCase();
    const storedUser = this.getStoredUser();

    const candidates = [storedUser, this.demoAccount].filter(Boolean) as StoredCredentials[];
    const match = candidates.find((user) => {
      const roleMatches = !role || user.role === role;
      return user.email === normalizedEmail && user.password === password && roleMatches;
    });

    if (!match) {
      return null;
    }

    return this.setSession(match);
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
  }

  updateProfile(profile: Partial<AuthUser>): AuthUser | null {
    const sessionUser = this.currentUser;
    if (!sessionUser) {
      return null;
    }

    const updatedUser: AuthUser = {
      ...sessionUser,
      ...profile,
      name: profile.name?.trim() || sessionUser.name,
      email: profile.email?.trim().toLowerCase() || sessionUser.email,
      role: profile.role || sessionUser.role
    };

    localStorage.setItem(this.sessionKey, JSON.stringify(updatedUser));

    const storedUser = this.getStoredUser();
    if (storedUser) {
      const nextStoredUser: StoredCredentials = {
        ...storedUser,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        company: updatedUser.company,
        location: updatedUser.location,
        bio: updatedUser.bio,
        timezone: updatedUser.timezone
      };

      localStorage.setItem(this.userKey, JSON.stringify(nextStoredUser));
    }

    return updatedUser;
  }

  private getStoredUser(): StoredCredentials | null {
    const stored = localStorage.getItem(this.userKey);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as StoredCredentials;
    } catch {
      return null;
    }
  }

  private setSession(user: StoredCredentials): AuthUser {
    const authUser: AuthUser = {
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      location: user.location,
      bio: user.bio,
      timezone: user.timezone
    };

    localStorage.setItem(this.sessionKey, JSON.stringify(authUser));
    return authUser;
  }
}
