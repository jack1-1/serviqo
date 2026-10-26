import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TicketService } from '../../../core/services/ticket.service';
import { TicketLookup } from '../../../core/models/ticket-lookup.model';
@Component({
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  selector: 'app-create-ticket',
  styleUrl: './create-ticket.scss',
  templateUrl: './create-ticket.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTicket {
  private readonly _ticketService = inject(TicketService);
  private readonly fb = inject(FormBuilder);

  readonly categories = signal<TicketLookup[]>([]);
  readonly priorities = signal<TicketLookup[]>([]);

  readonly isLoadingLookups = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly ticketForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    categoryId: ['', Validators.required],
    priorityId: ['', Validators.required]
  })
  constructor() {

  }

  ngOnInit(): void {
    this.loadLookups();
  }

  loadLookups(): void {
    this.isLoadingLookups.set(true);
    this.errorMessage.set('');

    forkJoin({
      categories:this._ticketService.getCategories(),
      priorities:this._ticketService.getPriorities()
    }).subscribe({
      next:({categories,priorities})=>{
        this.categories.set(categories?.data);
        this.priorities.set(priorities?.data);
        this.isLoadingLookups.set(false);
      },
      error:()=>{
        this.errorMessage.set(
          'Unable to load ticket categories or priorities. Please try again.'
        );
        this.isLoadingLookups.set(false);
      }
    })
  }

  //
   submitTicket(): void {
    this.ticketForm.markAllAsTouched();

    if (this.ticketForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const formValue = this.ticketForm.getRawValue();

    this._ticketService.createTicket({
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      categoryId: Number(formValue.categoryId),
      priorityId: Number(formValue.priorityId)
    }).subscribe({
      next: (response:any) => {
        this.successMessage.set(
          response.message || 'Ticket created successfully.'
        );
        this.ticketForm.reset();
        this.isSubmitting.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Unable to create ticket. Please try again.'
        );
        this.isSubmitting.set(false);
      }
    });
  }
}
