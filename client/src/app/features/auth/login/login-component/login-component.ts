import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { AuthstateService } from '../../../../core/services/auth-state.service';
import { finalize, firstValueFrom, switchMap } from 'rxjs';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RouterLink, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  private readonly fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _tokenService = inject(TokenService);
  private readonly _authStateService = inject(AuthstateService);
  private readonly router = inject(Router)

  readonly isSubmitting = signal(false);
  readonly hidePassword = signal(true);


  readonly loginForm = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required
      ]
    ]
  });

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.getRawValue();
    this.isSubmitting.set(true);
    this._authService.login(credentials).pipe(
      switchMap(response => {
        this._tokenService.setToken((response.data as { token: string })?.token);
        return this._authService.getCurrentUser();
      }),
      finalize(() => {
        this.isSubmitting.set(false);
      })
    ).subscribe(
      {
        next: (authContext) => {
          this._authStateService.setAuthContext(authContext);
          console.log('reached dash route');
          
          this.router.navigate(['/dashboard']);
        },

        error: (error) => {
          this._tokenService.clearToken();
          this._authStateService.clear();
          // show login error
        }

      })
  }
}
