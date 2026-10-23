import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthstateService } from "./auth-state.service";
import { TokenService } from "./token.service";
import { LoginRequest, LoginResponse, Authcontext } from "../models/auth-model";
import { environment } from "../../../environments/environment";
import { API_ENDPOINTS } from "../constants/api.constants";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly tokenService = inject(TokenService);
    private readonly authStateService = inject(AuthstateService);
    private readonly router = inject(Router);

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(
            `${environment.url}${API_ENDPOINTS.AUTH.LOGIN}`,
            credentials
        );
    }
    // /auth/me //
    getCurrentUser(): Observable<Authcontext> {
        return this.http.get<Authcontext>(`${environment.url}${API_ENDPOINTS.AUTH.AUTHCONTEXT}`);
    }

    private isLoggingOut = false;
    logout(): void {

        if (this.isLoggingOut) {
            return;
        }

        this.isLoggingOut = true;

        this.tokenService.clearToken();
        this.authStateService.clear();

        this.router.navigate(['/login'])
            .finally(() => {
                this.isLoggingOut = false;
            });
    }
}