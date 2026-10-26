import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api.constants';
import { DashboardResponse } from '../models/dashboard.model';
import { TicketLookup, CreateTicketRequest, CreateTicketResponse, TicketLookupResponse } from '../models/ticket-lookup.model';
import {TicketSearchRequest,TicketSearchResponse} from '../models/ticket-search.model';
@Injectable({
    providedIn: 'root'
})
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.url;

  getCategories(): Observable<TicketLookupResponse> {
    return this.http.get<TicketLookupResponse>(
      `${this.baseUrl}${API_ENDPOINTS.TICKETS.CATEGORIES}`
    );
  }

  getPriorities(): Observable<TicketLookupResponse> {
    return this.http.get<TicketLookupResponse>(
      `${this.baseUrl}${API_ENDPOINTS.TICKETS.PRIORITIES}`
    );
  }

  getStatuses(): Observable<TicketLookupResponse> {
    return this.http.get<TicketLookupResponse>(
      `${this.baseUrl}${API_ENDPOINTS.TICKETS.STATUSES}`
    );
  }


  createTicket(payload: CreateTicketRequest): Observable<unknown> {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.TICKETS.CREATE}`,
      payload
    );
  }

  searchTickets(payload: TicketSearchRequest):Observable<TicketSearchResponse>{
    return this.http.post<TicketSearchResponse>(
      `${this.baseUrl}${API_ENDPOINTS.TICKETS.SEARCH}`,
      payload)
  }
}