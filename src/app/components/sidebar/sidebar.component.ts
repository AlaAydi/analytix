import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class SidebarComponent {
  @Input() activeTab: string = 'dashboard';
  @Input() userName: string = 'Aydi Ala';
  @Input() userRole: 'Administrateur' | 'Client' = 'Administrateur';

  @Output() tabChange = new EventEmitter<string>();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  selectTab(tab: string): void {
    this.tabChange.emit(tab);
  }

  get isAdmin(): boolean {
    return this.userRole === 'Administrateur';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
