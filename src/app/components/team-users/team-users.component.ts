import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Role = 'Admin' | 'Manager' | 'Analyst' | 'Support';

interface TeamMember {
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Invited' | 'Disabled';
}

@Component({
  selector: 'app-team-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-users.component.html',
  styleUrls: ['./team-users.component.css']
})
export class TeamUsersComponent {
  roleFilter = 'all';

  members: TeamMember[] = [
    { name: 'Aydi Ala', email: 'aydi.ala@example.com', role: 'Admin', status: 'Active' },
    { name: 'Sarah Martin', email: 'sarah@company.com', role: 'Manager', status: 'Active' },
    { name: 'Luca Perez', email: 'luca@company.com', role: 'Analyst', status: 'Invited' },
    { name: 'Mina Diallo', email: 'mina@company.com', role: 'Support', status: 'Disabled' }
  ];

  get filteredMembers(): TeamMember[] {
    return this.roleFilter === 'all' ? this.members : this.members.filter((member) => member.role === this.roleFilter);
  }

  get roles(): string[] {
    return ['all', ...new Set(this.members.map((member) => member.role))];
  }

  toggleStatus(member: TeamMember): void {
    member.status = member.status === 'Disabled' ? 'Invited' : 'Disabled';
  }
}
