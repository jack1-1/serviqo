export interface TicketAISuggestionsRequest {
  description: string;
}

export interface TicketAISuggestions {
  summary: string;
  suggestedCategoryId: string;
  suggestedPriorityId: string;
  troubleshootingSteps: string[];
}

export interface TicketAISuggestionsResponse {
  message: string;
  data: TicketAISuggestions;
}

export interface TicketAISuggestions {
  summary: string;
  suggestedCategoryId: string;
  suggestedPriorityId: string;
  troubleshootingSteps: string[];
}