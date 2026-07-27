import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface NotificationItem {
  title: string;
  description: string;
  time: string;
  type: 'success' | 'warning' | 'info';
  read: boolean;
}

@Component({
  selector: 'app-notifications-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-feed.component.html',
  styleUrls: ['./notifications-feed.component.css']
})
export class NotificationsFeedComponent {
  notifications: NotificationItem[] = [
    { title: 'Rapport généré', description: 'Le rapport mensuel est prêt au téléchargement.', time: '2 min', type: 'success', read: false },
    { title: 'Stock faible', description: 'API Connector Bundle est presque épuisé.', time: '18 min', type: 'warning', read: false },
    { title: 'Connexion API', description: 'Stripe Payments API a répondu avec succès.', time: '1 h', type: 'info', read: true }
  ];

  get unreadCount(): number {
    return this.notifications.filter((notification) => !notification.read).length;
  }

  markAllRead(): void {
    this.notifications = this.notifications.map((notification) => ({ ...notification, read: true }));
  }
}
