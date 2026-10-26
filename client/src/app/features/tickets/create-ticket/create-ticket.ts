import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TicketService } from '../../../core/services/ticket.service';
import { TicketLookup } from '../../../core/models/ticket-lookup.model';
import { TicketAISuggestions, TicketAISuggestionsResponse } from  '../../../core/models/ticket-ai.model';
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

  readonly isGeneratingSuggestions = signal(false);
  readonly aiErrorMessage = signal('');
  readonly aiSuggestions = signal<TicketAISuggestions | null>(null);
  readonly aiDescription = signal('');

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

  //
  generateAISuggestions(): void {
  const description = this.aiDescription().trim();

  this.aiErrorMessage.set('');
  this.aiSuggestions.set(null);

  if (!description) {
    this.aiErrorMessage.set(
      'Please describe your issue before requesting AI suggestions.'
    );
    return;
  }

  // Your backend accepts descriptions up to 3000 characters.
  if (description.length > 3000) {
    this.aiErrorMessage.set(
      'Description cannot exceed 3000 characters for AI suggestions.'
    );
    return;
  }

  if (this.isGeneratingSuggestions() || this.isSubmitting()) {
    return;
  }

  this.isGeneratingSuggestions.set(true);

  this._ticketService.getTicketSuggestions({ description }).subscribe({
    next: (response: TicketAISuggestionsResponse) => {
      this.aiSuggestions.set(response.data);
      this.isGeneratingSuggestions.set(false);
    },
    error: (error) => {
      this.aiErrorMessage.set(
        error?.error?.message ||
        'Unable to generate AI suggestions. Please try again.'
      );
      this.isGeneratingSuggestions.set(false);
    }
  });
}


//
applyAISuggestions(): void {
  const suggestions = this.aiSuggestions();

  if (!suggestions) {
    return;
  }

  const categoryExists = this.categories().some(
    category => String(category.id) === suggestions.suggestedCategoryId
  );

  const priorityExists = this.priorities().some(
    priority => String(priority.id) === suggestions.suggestedPriorityId
  );

  if (!categoryExists || !priorityExists) {
    this.aiErrorMessage.set(
      'The suggested category or priority is no longer available. Please try again.'
    );
    return;
  }

  this.ticketForm.patchValue({
    title: suggestions.summary,
    description: this.aiDescription().trim(),
    categoryId: suggestions.suggestedCategoryId,
    priorityId: suggestions.suggestedPriorityId
  });

  this.ticketForm.controls.title.markAsTouched();
  this.aiErrorMessage.set('');
}
/////
getCategoryName(categoryId: string): string {
  return this.categories().find(
    category => String(category.id) === categoryId
  )?.name ?? 'Unavailable';
}

getPriorityName(priorityId: string): string {
  return this.priorities().find(
    priority => String(priority.id) === priorityId
  )?.name ?? 'Unavailable';
}
}
