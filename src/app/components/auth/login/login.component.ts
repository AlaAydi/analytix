import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = 'demo@analytix.app';
  password = 'Analytix123!';
  role: 'Administrateur' | 'Client' = 'Administrateur';
  rememberMe = true;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.isSubmitting = true;

    setTimeout(() => {
      const user = this.authService.login(this.email, this.password, this.role);

      if (!user) {
        this.isSubmitting = false;
        this.errorMessage = 'Identifiants invalides ou rôle incorrect. Essayez à nouveau.';
        return;
      }

      if (!this.rememberMe) {
        sessionStorage.setItem('analytic-dashboard-temp', 'true');
      }

      this.router.navigate(['/dashboard']);
    }, 450);
  }
}
