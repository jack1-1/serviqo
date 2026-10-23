import { inject } from "@angular/core";
import { Router, ActivatedRouteSnapshot, CanActivateFn } from "@angular/router";
import { AuthstateService } from "../services/auth-state.service";
import { Permission } from "../constants/permissions";
export const permissionGuard:CanActivateFn=(
    route:ActivatedRouteSnapshot
)=>{
    const _authStateService= inject(AuthstateService);
    const router = inject(Router);
    const permission= route.data['permission'] as Permission | undefined;
    if(!permission){
        return true;
    }
    if(_authStateService.hasPermission(permission)){
        return true;
    }

    return router.createUrlTree(['/dashboard']);
}