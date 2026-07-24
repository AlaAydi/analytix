import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports-view.component.html',
  styleUrls: ['./reports-view.component.css']
})
export class ReportsViewComponent {
  @Input() reportType: string = 'financial';
  @Input() reportFormat: string = 'pdf';
  @Input() reportOptions: any = { transactions: true, charts: true, projections: false, comparative: true };
  @Input() isGeneratingReport: boolean = false;
  @Input() generationProgress: number = 0;
  @Input() generatedReports: any[] = [];
  @Input() userName: string = 'Aydi Ala';
  @Input() lastUpdated: Date = new Date();
  @Input() dateFilterLabel: string = '30 Derniers Jours';
  @Input() dateFilter: string = '30d';

  @Output() reportTypeChange = new EventEmitter<string>();
  @Output() reportFormatChange = new EventEmitter<string>();
  @Output() generateReport = new EventEmitter<void>();
  @Output() downloadReport = new EventEmitter<any>();

  onReportTypeChange(val: string): void {
    this.reportType = val;
    this.reportTypeChange.emit(val);
  }

  onReportFormatChange(val: string): void {
    this.reportFormat = val;
    this.reportFormatChange.emit(val);
  }

  onGenerateReport(): void {
    this.generateReport.emit();
  }

  onDownloadReport(rep: any): void {
    this.downloadReport.emit(rep);
  }

  getReportTypeName(type: string): string {
    switch (type) {
      case 'financial': return 'Performance Financière';
      case 'traffic': return 'Trafic et Acquisition';
      case 'conversion': return 'Audit de Conversion';
      default: return 'Activité Générale';
    }
  }
}
