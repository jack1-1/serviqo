
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api.constants';
import { DashboardResponse } from '../models/dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private readonly http = inject(HttpClient);

    getSummary(): Observable<DashboardResponse> {
        return this.http.get<DashboardResponse>(
            `${environment.url}${API_ENDPOINTS.DASHBOARD.SUMMARY}`
        );
    }
}
