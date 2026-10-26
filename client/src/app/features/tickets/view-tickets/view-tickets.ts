
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule
} from '@angular/forms';
import { forkJoin } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TicketService } from '../../../core/services/ticket.service';
import { TicketLookup } from '../../../core/models/ticket-lookup.model';
import {
  SearchTicket,
  TicketDateRange,
  TicketSearchRequest,
  TicketSearchResult
} from '../../../core/models/ticket-search.model';

@Component({
  selector: 'app-view-tickets',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  styleUrl: './view-tickets.scss',
  templateUrl: './view-tickets.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewTickets implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ticketService = inject(TicketService);

  readonly categories = signal<TicketLookup[]>([]);
  readonly priorities = signal<TicketLookup[]>([]);
  readonly statuses = signal<TicketLookup[]>([]);

  readonly tickets = signal<SearchTicket[]>([]);
  readonly pagination = signal({
    page: 1,
    limit: 5,
    totalRecords: 0,
    totalPages: 0
  });

  readonly isLoading = signal(false);
  readonly isLoadingLookups = signal(false);
  readonly errorMessage = signal('');
  readonly filtersChanged = signal(false);

  readonly hasActiveFilters = computed(() => {
    const filters = this.filtersChanged();
    return filters;
  });

  readonly dateRanges: {
    value: TicketDateRange;
    label: string;
  }[] = [
    // { value: 'all', label: 'All dates' },
    { value: 'TODAY', label: 'Today' },
    { value: 'LAST_7_DAYS', label: 'Last 7 days' },
    { value: 'LAST_30_DAYS', label: 'Last 30 days' },
    { value: 'LAST_90_DAYS', label: 'Last 90 days' }
  ];

  readonly filterForm = this.fb.nonNullable.group({
    search: [''],
    dateRange: this.fb.nonNullable.control<TicketDateRange>('LAST_7_DAYS'),
    statusIds: this.fb.nonNullable.control<string[]>([]),
    priorityIds: this.fb.nonNullable.control<string[]>([]),
    categoryIds: this.fb.nonNullable.control<string[]>([])
  });

  ngOnInit(): void {
    this.loadLookups();

    this.filterForm.valueChanges.subscribe(() => {
      this.filtersChanged.set(true);
    });
  }

  loadLookups(): void {
    this.isLoadingLookups.set(true);
    this.errorMessage.set('');

    forkJoin({
      categories: this.ticketService.getCategories(),
      priorities: this.ticketService.getPriorities(),
      statuses: this.ticketService.getStatuses()
    }).subscribe({
      next: ({ categories, priorities, statuses }) => {
        this.categories.set(categories.data);
        this.priorities.set(priorities.data);
        this.statuses.set(statuses.data);
        this.isLoadingLookups.set(false);

        this.searchTickets();
      },
      error: () => {
        this.errorMessage.set(
          'Unable to load ticket filters. Please retry.'
        );
        this.isLoadingLookups.set(false);
      }
    });
  }

  searchTickets(page = 1): void {
    if (this.isLoading()) {
      return;
    }

    const formValue = this.filterForm.getRawValue();

    const request: TicketSearchRequest = {
      page,
      limit: this.pagination().limit,
      dateRange: formValue.dateRange,
      search: formValue.search.trim(),
      statusIds: formValue.statusIds.map(Number),
      priorityIds: formValue.priorityIds.map(Number),
      categoryIds: formValue.categoryIds.map(Number),
      teamIds: [],
      assignedToIds: []
    };

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.ticketService.searchTickets(request).subscribe({
      next: response => {
        this.tickets.set(response.data.tickets);
        this.pagination.set(response.data.pagination);
        this.filtersChanged.set(false);
        this.isLoading.set(false);
      },
      error: error => {
        this.errorMessage.set(
          error?.error?.message || 'Unable to fetch tickets.'
        );
        this.isLoading.set(false);
      }
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      dateRange: 'LAST_7_DAYS',
      statusIds: [],
      priorityIds: [],
      categoryIds: []
    });

    this.filtersChanged.set(false);
    this.searchTickets(1);
  }

  previousPage(): void {
    const current = this.pagination().page;

    if (current > 1) {
      this.searchTickets(current - 1);
    }
  }

  nextPage(): void {
    const { page, totalPages } = this.pagination();

    if (page < totalPages) {
      this.searchTickets(page + 1);
    }
  }

  lookupName(
    id: number | string,
    lookups: TicketLookup[]
  ): string {
    return lookups.find(item => Number(item.id) === Number(id))?.name
      ?? '—';
  }

  trackTicket(_index: number, ticket: SearchTicket): number | string {
    return ticket.id;
  }
}

