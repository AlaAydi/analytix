import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.css']
})
export class SettingsViewComponent {
  @Input() userName: string = 'Aydi Ala';
  @Input() userEmail: string = 'aydi.ala@example.com';
  @Input() userRole: string = 'Administrateur';
  @Input() enableSound: boolean = true;
  @Input() isDarkMode: boolean = true;
  @Input() refreshInterval: number = 4;
  
  @Input() apiKeys: any = {
    googleAnalytics: 'G-74X89L0WZ2',
    stripeKey: 'sk_test_51Nz8P3J3zLz8R2o9v8X9...',
    webhookUrl: 'https://api.analytix.com/v1/webhooks'
  };
  @Input() showApiKeys: any = {
    googleAnalytics: false,
    stripeKey: false
  };
  @Input() apiTesting: any = {
    stripe: false,
    google: false
  };
  @Input() apiStatus: any = {
    stripe: 'disconnected',
    google: 'disconnected'
  };
  @Input() systemLogs: string[] = [];

  @Output() saveProfile = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() enableSoundChange = new EventEmitter<boolean>();
  @Output() refreshIntervalChange = new EventEmitter<number>();
  @Output() testApiConnection = new EventEmitter<'stripe' | 'google'>();
  @Output() toggleApiKeyVisibility = new EventEmitter<'googleAnalytics' | 'stripeKey'>();
  @Output() purgeCache = new EventEmitter<void>();
  @Output() exportBackup = new EventEmitter<void>();

  onSaveProfile(): void {
    this.saveProfile.emit();
  }

  onToggleTheme(): void {
    this.toggleTheme.emit();
  }

  onToggleSound(): void {
    this.enableSound = !this.enableSound;
    this.enableSoundChange.emit(this.enableSound);
  }

  onRefreshIntervalChange(val: number): void {
    this.refreshIntervalChange.emit(val);
  }

  onTestApiConnection(provider: 'stripe' | 'google'): void {
    this.testApiConnection.emit(provider);
  }

  onToggleApiKeyVisibility(key: 'googleAnalytics' | 'stripeKey'): void {
    this.toggleApiKeyVisibility.emit(key);
  }

  onPurgeCache(): void {
    this.purgeCache.emit();
  }

  onExportBackup(): void {
    this.exportBackup.emit();
  }
}
