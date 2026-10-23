import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { TokenService } from "./token.service";
import { AuthService } from "./auth.service";
import { AuthstateService } from "./auth-state.service";

@Injectable({
    providedIn: 'root'
})

export class AuthInitializerService {
    private readonly _tokenService = inject(TokenService);
    private readonly _authService = inject(AuthService);
    private readonly _authStateService = inject(AuthstateService);

    async initialize(): Promise<void> {
        const token = this._tokenService.getToken();
        if (!token) {
            return;
        }

        try {
            const authcontext = await firstValueFrom(
                this._authService.getCurrentUser() //get user deatils role, permissions
            )
            this._authStateService.setAuthContext(authcontext); //set the auth state of logged in user
        } catch (error) {
            console.error('Failed to restore authentication state', error); 
            // this._tokenService.clearToken(); // now interceptor will handle 401
            // this._authStateService.clear();
        }
    }

}