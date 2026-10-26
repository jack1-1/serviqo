import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject, ChangeDetectorRef,NgZone } from '@angular/core';
// Inside the next callback
console.log('Inside Angular zone:', NgZone.isInAngularZone());
import { AuthstateService } from '../../core/services/auth-state.service';
import { DashboardService } from '../../core/services/dashboard.service';
import {
  DashboardData,
  DashboardSummary,
  RecentTicket
} from '../../core/models/dashboard.model';

import { finalize } from 'rxjs';
import { signal } from '@angular/core';
interface DashboardCard {
  label: string;
  value: number;
  icon: string;
}

@Component({
  imports: [CommonModule],
  standalone:true,
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly _authStateService = inject(AuthstateService);
  private readonly dashboardService = inject(DashboardService);
  private readonly cdr = inject(ChangeDetectorRef);
  // dashboard: DashboardData | null = null;
  // loading = false;
  // errorMessage = '';

  dashboard = signal<DashboardData | null>(null);
loading = signal(false);
errorMessage = signal('');

  constructor() {
    // console.log(this._authStateService.permissions());
  }
  
  ngOnInit(): void {
    this.loadDashboard();
  }


loadDashboard(): void {
  this.loading.set(true);
  this.errorMessage.set('');

  this.dashboardService.getSummary().subscribe({
    next: (response) => {
      this.dashboard.set(response.data);
      this.loading.set(false);
    },
    error: (error) => {
      this.errorMessage.set(
        error?.error?.message || 'Failed to load dashboard.'
      );
      this.loading.set(false);
    }
  });
}

  get summaryCards(): DashboardCard[] {
    if (!this.dashboard) {
      return [];
    }

    const summary = this.dashboard()?.summary;

    switch (this.dashboard()?.effectiveRole) {
      case 'ADMIN':
        return [
          {
            label: 'Total Tickets',
            value: summary?.totalTickets ?? 0,
            icon: 'bi-ticket-perforated'
          },
          {
            label: 'Open Tickets',
            value: summary?.openTickets ?? 0,
            icon: 'bi-folder2-open'
          },
          {
            label: 'Resolved Tickets',
            value: summary?.resolvedTickets ?? 0,
            icon: 'bi-check-circle'
          }
        ];

      case 'MANAGER':
        return [
          {
            label: 'Team Tickets',
            value: summary?.teamTickets ?? 0,
            icon: 'bi-people'
          },
          {
            label: 'Open Tickets',
            value: summary?.openTickets ?? 0,
            icon: 'bi-folder2-open'
          },
          {
            label: 'Unassigned Tickets',
            value: summary?.unassignedTickets ?? 0,
            icon: 'bi-person-exclamation'
          }
        ];

      case 'SUPPORT_AGENT':
        return [
          {
            label: 'Assigned to Me',
            value: summary?.assignedToMe ?? 0,
            icon: 'bi-person-workspace'
          },
          {
            label: 'Open Tickets',
            value: summary?.openTickets ?? 0,
            icon: 'bi-folder2-open'
          },
          {
            label: 'High-Priority Tickets',
            value: summary?.highPriorityTickets ?? 0,
            icon: 'bi-exclamation-triangle'
          }
        ];

      case 'CUSTOMER':
        return [
          {
            label: 'My Tickets',
            value: summary?.myTickets ?? 0,
            icon: 'bi-ticket-perforated'
          },
          {
            label: 'Open Tickets',
            value: summary?.openTickets ?? 0,
            icon: 'bi-folder2-open'
          },
          {
            label: 'Resolved Tickets',
            value: summary?.resolvedTickets ?? 0,
            icon: 'bi-check-circle'
          }
        ];

      default:
        return [];
    }
  }

  get roleLabel(): string {
    switch (this.dashboard()?.effectiveRole) {
      case 'ADMIN':
        return 'Administrator';
      case 'MANAGER':
        return 'Team Manager';
      case 'SUPPORT_AGENT':
        return 'Support Agent';
      case 'CUSTOMER':
        return 'Customer';
      default:
        return 'Dashboard';
    }
  }

  statusClass(statusCode: string): string {
    switch (statusCode) {
      case 'OPEN':
        return 'status-open';
      case 'IN_PROGRESS':
        return 'status-progress';
      case 'WAITING_FOR_CUSTOMER':
        return 'status-waiting';
      case 'RESOLVED':
        return 'status-resolved';
      case 'CLOSED':
        return 'status-closed';
      case 'REOPENED':
        return 'status-reopened';
      default:
        return 'status-default';
    }
  }

  priorityClass(priorityCode: string): string {
    switch (priorityCode) {
      case 'LOW':
        return 'priority-low';
      case 'MEDIUM':
        return 'priority-medium';
      case 'HIGH':
        return 'priority-high';
      case 'CRITICAL':
        return 'priority-critical';
      default:
        return 'priority-default';
    }
  }

  trackTicket(_index: number, ticket: RecentTicket): number {
    return ticket.id;
  }
}
