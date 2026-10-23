import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { TokenService } from "../services/token.service";
import { AuthService } from "../services/auth.service";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const PUBLIC_ENDPOINTS = [
        '/auth/login',
        '/auth/register'
    ];
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(
        endpoint => req.url.includes(endpoint)
    );

    if (isPublicEndpoint) {
        return next(req);
    }
    const _tokenService = inject(TokenService);
    const _authService = inject(AuthService);
    const router = inject(Router);
    const token = _tokenService.getToken();
    if (!token) {
        return next(req);
    }

    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    return next(authReq).pipe(

        catchError((error: HttpErrorResponse) => {

            if (error.status === 401) {
                _authService.logout();
            }

            return throwError(() => error);
        })

    );
};