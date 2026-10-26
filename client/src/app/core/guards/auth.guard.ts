import {CanActivateFn,Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthstateService } from "../services/auth-state.service";

export const authGuard : CanActivateFn= ()=>{
const _authStateService= inject(AuthstateService);
const router= inject(Router);
// console.log(_authStateService.isAuthenticated());

if(_authStateService.isAuthenticated()){
    return true;
}
return router.createUrlTree(['/login']);
}