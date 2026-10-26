export interface TicketLookup {
  id: number;
  code: string;
  name: string;
  description: string | null;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  categoryId: number;
  priorityId: number;
}

export interface CreateTicketResponse {
  message: string;
  data: unknown; // We'll replace this with your actual ticket response type.
}

export interface TicketLookupResponse {
  message: string;
  data: TicketLookup[];
}


