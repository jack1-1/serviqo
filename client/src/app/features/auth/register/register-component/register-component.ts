
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterRequest } from '../../../../core/models/register-model';
function passwordsMatch(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword
    ? null
    : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly isSubmitting = signal(false);
  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly registerForm = this.fb.nonNullable.group(
    {
      firstName: [
        '',
        [Validators.required, Validators.maxLength(50)]
      ],
      lastName: [
        '',
        [Validators.required, Validators.maxLength(50)]
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(254)]
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+?[0-9]{10,15}$/)
        ]
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(72)]
      ],
      confirmPassword: ['', Validators.required]
    },
    { validators: passwordsMatch }
  );

  submitRegistration(): void {
    this.registerForm.markAllAsTouched();
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.registerForm.invalid || this.isSubmitting()) {
      return;
    }

    const formValue = this.registerForm.getRawValue();

    const payload: RegisterRequest = {
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      email: formValue.email.trim(),
      phone: formValue.phone.trim(),
      password: formValue.password
    };

    this.isSubmitting.set(true);

    this.authService.register(payload).subscribe({
      next: response => {
        if (!response.success) {
          this.errorMessage.set(
            response.message || response.messgae || 'Registration failed.'
          );
          this.isSubmitting.set(false);
          return;
        }

        this.successMessage.set(
          response.message ||
          response.messgae ||
          'User registered successfully.'
        );

        this.registerForm.reset();
        this.isSubmitting.set(false);
      },
      error: error => {
        this.errorMessage.set(
          error?.error?.message ||
          error?.error?.messgae ||
          'Unable to register. Please try again.'
        );
        this.isSubmitting.set(false);
      }
    });
  }
}
