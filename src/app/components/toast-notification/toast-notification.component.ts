import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.css'],
  animations: [
    trigger('slideBounceToast', [
      transition(':enter', [
        style({ transform: 'translateY(-100px)', opacity: 0 }),
        animate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.6, -0.28, 0.735, 0.045)', style({ transform: 'translateY(-100px)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastNotificationComponent {
  @Input() message: string = '';
  @Input() show: boolean = false;
}
