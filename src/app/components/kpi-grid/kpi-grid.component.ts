import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface KPI {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  iconName: string;
  color: string;
  sparkline: number[];
}

@Component({
  selector: 'app-kpi-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-grid.component.html',
  styleUrls: ['./kpi-grid.component.css']
})
export class KpiGridComponent {
  @Input() kpis: KPI[] = [];

  getSparklinePath(points: number[]): string {
    if (!points || points.length === 0) return '';
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min === 0 ? 1 : max - min;
    const width = 120;
    const height = 40;
    const stepX = width / (points.length - 1);
    
    return points.map((p, i) => {
      const x = i * stepX;
      const y = height - ((p - min) / range) * (height - 6) - 3;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  }

  getKpiColorHex(colorName: string): string {
    switch (colorName) {
      case 'indigo': return '#6366f1';
      case 'emerald': return '#10b981';
      case 'amber': return '#f59e0b';
      case 'rose': return '#f43f5e';
      default: return '#6366f1';
    }
  }
}
