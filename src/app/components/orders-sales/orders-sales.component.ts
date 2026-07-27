import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type OrderStatus = 'Paid' | 'Pending' | 'Refunded';

interface OrderItem {
  orderId: string;
  customer: string;
  channel: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

@Component({
  selector: 'app-orders-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-sales.component.html',
  styleUrls: ['./orders-sales.component.css']
})
export class OrdersSalesComponent {
  orders: OrderItem[] = [
    { orderId: 'ORD-501', customer: 'Société Alpha', channel: 'Web', amount: 1890, status: 'Paid', date: 'Aujourd’hui' },
    { orderId: 'ORD-502', customer: 'Studio Nova', channel: 'Mobile', amount: 760, status: 'Pending', date: 'Hier' },
    { orderId: 'ORD-503', customer: 'Retail Zen', channel: 'Marketplace', amount: 420, status: 'Refunded', date: 'Hier' },
    { orderId: 'ORD-504', customer: 'Delta Group', channel: 'Direct', amount: 2450, status: 'Paid', date: 'Aujourd’hui' }
  ];

  statusCount(status: OrderStatus): number {
    return this.orders.filter((order) => order.status === status).length;
  }
}
