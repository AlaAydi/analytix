import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-analytics-view',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  templateUrl: './analytics-view.component.html',
  styleUrls: ['./analytics-view.component.css']
})
export class AnalyticsViewComponent {
  @Input() activeAnalyticsMetric: 'sessions' | 'conversions' | 'bounce' | 'value' = 'sessions';
  @Input() analyticsChartType: ChartConfiguration['type'] = 'line';
  @Input() analyticsChartData!: ChartConfiguration['data'];
  @Input() analyticsChartOptions!: ChartConfiguration['options'];

  @Input() deviceChartType: ChartConfiguration['type'] = 'doughnut';
  @Input() deviceChartData!: ChartConfiguration['data'];
  @Input() deviceChartOptions!: ChartConfiguration['options'];

  @Input() countries: any[] = [];

  @Output() metricChange = new EventEmitter<'sessions' | 'conversions' | 'bounce' | 'value'>();

  setMetric(metric: 'sessions' | 'conversions' | 'bounce' | 'value'): void {
    this.metricChange.emit(metric);
  }

  getAnalyticsChartLabel(): string {
    switch (this.activeAnalyticsMetric) {
      case 'sessions': return 'Visites (Sessions)';
      case 'conversions': return 'Taux de Conversion (%)';
      case 'bounce': return 'Taux de Rebond (%)';
      case 'value': return 'Panier Moyen (€)';
      default: return 'Sessions';
    }
  }
}
