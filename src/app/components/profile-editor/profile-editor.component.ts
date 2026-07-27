import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ProfileUpdate {
  name: string;
  email: string;
  role: string;
  company: string;
  location: string;
  bio: string;
  timezone: string;
}

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent {
  @Input() userName = 'Aydi Ala';
  @Input() userEmail = 'aydi.ala@example.com';
  @Input() userRole = 'Administrateur';
  @Input() userCompany = 'Analytix Studio';
  @Input() userLocation = 'Remote';
  @Input() userBio = 'Pilotage produit, reporting et expérience data pour les équipes modernes.';
  @Input() userTimezone = 'Europe/Paris';

  @Output() saveProfile = new EventEmitter<ProfileUpdate>();
  @Output() cancelEdit = new EventEmitter<void>();

  avatarInitials(): string {
    return this.userName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('');
  }

  onSave(): void {
    this.saveProfile.emit({
      name: this.userName,
      email: this.userEmail,
      role: this.userRole,
      company: this.userCompany,
      location: this.userLocation,
      bio: this.userBio,
      timezone: this.userTimezone
    });
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }
}
