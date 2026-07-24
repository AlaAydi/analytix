import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `<canvas #chartCanvas style="width: 100%; height: 100%;"></canvas>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() type!: ChartConfiguration['type'];
  @Input() data!: ChartConfiguration['data'];
  @Input() options?: ChartConfiguration['options'];

  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart) {
      if (changes['data'] && !changes['data'].firstChange) {
        this.chart.data = this.data;
        this.chart.update();
      }
      if (changes['options'] && !changes['options'].firstChange) {
        this.chart.options = this.options || {};
        this.chart.update();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(): void {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: this.type,
      data: this.data,
      options: this.options || {}
    });
  }
}
