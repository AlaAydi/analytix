import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Transaction {
  id: string;
  date: Date;
  customer: string;
  category: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.css']
})
export class TransactionTableComponent {
  @Input() transactions: Transaction[] = [];
  @Output() exportCsv = new EventEmitter<void>();

  searchText: string = '';
  statusFilter: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 5;

  get filteredTransactions(): Transaction[] {
    let result = [...this.transactions];

    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase().trim();
      result = result.filter(t => 
        t.customer.toLowerCase().includes(search) || 
        t.category.toLowerCase().includes(search) || 
        t.id.toLowerCase().includes(search)
      );
    }

    if (this.statusFilter !== 'all') {
      result = result.filter(t => t.status.toLowerCase() === this.statusFilter.toLowerCase());
    }

    return result;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.itemsPerPage) || 1;
  }

  get paginatedTransactions(): Transaction[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTransactions.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  onExportCsv(): void {
    this.exportCsv.emit();
  }
}
