import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})

export class TokenService{
    private readonly TOKEN_KEY='access_token';

    setToken(token:string):void{
        sessionStorage.setItem(this.TOKEN_KEY,token);
    }

    getToken():string | null{
        return sessionStorage.getItem(this.TOKEN_KEY);
    }

    clearToken():void{
        sessionStorage.removeItem(this.TOKEN_KEY);
    }

    hasToken():boolean{
        return !!this.getToken();
    }
}