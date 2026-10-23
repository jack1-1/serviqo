import { Injectable, signal, computed } from '@angular/core';

import { Authcontext } from '../models/auth-model';
import { Permission } from '../constants/permissions';
@Injectable({
    providedIn: 'root'
})

export class AuthstateService {
    private readonly _authContext = signal<Authcontext | null>(null);

    readonly authContext = this._authContext.asReadonly();

    readonly user =
        computed(() => this._authContext()?.data.user ?? null);

    readonly roles =
        computed(() => this._authContext()?.data.roles ?? []);

    readonly permissions =
        computed(() => this._authContext()?.data.permissions ?? []);

    readonly isAuthenticated =
        computed(() => this._authContext() !== null);

    setAuthContext(context: Authcontext): void {
        this._authContext.set(context);
    }

    clear(): void {
        this._authContext.set(null);
    }
    // single privilage//
    hasPermission(permission: Permission): boolean {
        return this.permissions().includes(permission);
    }
    // more than 1 privilage //
    hasAnyPermission(permissions: Permission[]): boolean {
        return permissions.some(
            permission => this.permissions().includes(permission)
        );
    }
    // all privilages//
    hasAllPermissions(permissions: Permission[]): boolean {
        return permissions.every(
            permission => this.permissions().includes(permission)
        );
    }
}
