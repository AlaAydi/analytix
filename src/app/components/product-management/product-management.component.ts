import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ProductStatus = 'In stock' | 'Low stock' | 'Paused';

interface ProductItem {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
}

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent {
  searchText = '';
  selectedCategory = 'all';

  products: ProductItem[] = [
    { name: 'Growth Analytics Pro', sku: 'PRD-101', category: 'Software', price: 249, stock: 84, status: 'In stock' },
    { name: 'Retail Starter Pack', sku: 'PRD-212', category: 'Service', price: 99, stock: 18, status: 'Low stock' },
    { name: 'Enterprise Support', sku: 'PRD-318', category: 'Service', price: 499, stock: 40, status: 'In stock' },
    { name: 'API Connector Bundle', sku: 'PRD-442', category: 'Integration', price: 149, stock: 0, status: 'Paused' }
  ];

  get categories(): string[] {
    return ['all', ...new Set(this.products.map((product) => product.category))];
  }

  get filteredProducts(): ProductItem[] {
    const search = this.searchText.trim().toLowerCase();
    return this.products.filter((product) => {
      const matchesSearch = !search || [product.name, product.sku, product.category].join(' ').toLowerCase().includes(search);
      const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  totalInventoryValue(): number {
    return this.products.reduce((sum, product) => sum + product.price * product.stock, 0);
  }

  markAsLowStock(product: ProductItem): void {
    product.status = 'Low stock';
  }
}
