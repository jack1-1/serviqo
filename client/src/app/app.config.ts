import { ApplicationConfig, provideBrowserGlobalErrorListeners,provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { withInterceptors,provideHttpClient } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthInitializerService } from './core/services/auth-initializer.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors(
        [
          authInterceptor
        ])
    ),
    provideAppInitializer(()=>{
      return inject(AuthInitializerService).initialize()
    }
    
    )
  ]
};
