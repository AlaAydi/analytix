import { Injectable } from '@angular/core';

export interface AuthUser {
  name: string;
  email: string;
  role: string;
}

interface StoredCredentials {
  name: string;
  email: string;
  password: string;
  role: string;
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

  register(name: string, email: string, password: string): AuthUser {
    const normalizedEmail = email.trim().toLowerCase();
    const user: StoredCredentials = {
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'Utilisateur'
    };

    localStorage.setItem(this.userKey, JSON.stringify(user));
    return this.setSession(user);
  }

  login(email: string, password: string): AuthUser | null {
    const normalizedEmail = email.trim().toLowerCase();
    const storedUser = this.getStoredUser();

    const candidates = [storedUser, this.demoAccount].filter(Boolean) as StoredCredentials[];
    const match = candidates.find((user) => user.email === normalizedEmail && user.password === password);

    if (!match) {
      return null;
    }

    return this.setSession(match);
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
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
      role: user.role
    };

    localStorage.setItem(this.sessionKey, JSON.stringify(authUser));
    return authUser;
  }
}