import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('slideDownHeader', [
      transition(':enter', [
        style({ transform: 'translateY(-30px)', opacity: 0 }),
        animate('350ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class HeaderComponent {
  @Input() activeTab: string = 'dashboard';
  @Input() lastUpdated: Date = new Date();
  @Input() isLiveSync: boolean = false;
  @Input() dateFilter: string = '30d';
  @Input() isDarkMode: boolean = true;

  @Output() toggleLiveSync = new EventEmitter<void>();
  @Output() dateFilterChange = new EventEmitter<string>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() exportPdf = new EventEmitter<void>();

  onLiveSyncToggle(): void {
    this.toggleLiveSync.emit();
  }

  onFilterChange(val: string): void {
    this.dateFilterChange.emit(val);
  }

  onThemeToggle(): void {
    this.toggleTheme.emit();
  }

  onExportPdf(): void {
    this.exportPdf.emit();
  }
}
