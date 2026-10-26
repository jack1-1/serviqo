
export type TicketDateRange =
  | 'all'
  | 'TODAY'
  | 'LAST_7_DAYS'
  | 'LAST_30_DAYS'
  | 'LAST_90_DAYS';

export interface TicketSearchRequest {
  page: number;
  limit: number;
  dateRange: TicketDateRange;
  search: string;
  statusIds: number[];
  priorityIds: number[];
  categoryIds: number[];
  teamIds: number[];
  assignedToIds: number[];
}

export interface SearchTicket {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  category_id: number;
  priority_id: number;
  status_id: number;
  created_by: number;
  assigned_to: number | null;
  team_id: number | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  closed_at: string | null;
}

export interface TicketPagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface TicketSearchResult {
  tickets: SearchTicket[];
  pagination: TicketPagination;
}

export interface TicketSearchResponse {
  message: string;
  data: TicketSearchResult;
}

