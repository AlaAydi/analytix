import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type TicketStatus = 'Open' | 'In progress' | 'Closed';

interface SupportTicket {
  id: string;
  subject: string;
  customer: string;
  priority: 'High' | 'Medium' | 'Low';
  status: TicketStatus;
}

@Component({
  selector: 'app-support-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-tickets.component.html',
  styleUrls: ['./support-tickets.component.css']
})
export class SupportTicketsComponent {
  searchText = '';

  tickets: SupportTicket[] = [
    { id: 'TCK-901', subject: 'Erreur de facture', customer: 'Delta Group', priority: 'High', status: 'Open' },
    { id: 'TCK-902', subject: 'Accès API perdu', customer: 'Studio Nova', priority: 'Medium', status: 'In progress' },
    { id: 'TCK-903', subject: 'Demande de formation', customer: 'Retail Zen', priority: 'Low', status: 'Closed' }
  ];

  get filteredTickets(): SupportTicket[] {
    const search = this.searchText.trim().toLowerCase();
    if (!search) {
      return this.tickets;
    }

    return this.tickets.filter((ticket) =>
      [ticket.id, ticket.subject, ticket.customer, ticket.priority, ticket.status].join(' ').toLowerCase().includes(search)
    );
  }

  cycleStatus(ticket: SupportTicket): void {
    if (ticket.status === 'Open') {
      ticket.status = 'In progress';
    } else if (ticket.status === 'In progress') {
      ticket.status = 'Closed';
    } else {
      ticket.status = 'Open';
    }
  }
}
