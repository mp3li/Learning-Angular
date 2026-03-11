import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  isSubmitting = false;
  errorMessage = '';

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    const email = this.form.controls.email.value.trim();
    const password = this.form.controls.password.value;

    this.authService.register(email, password).subscribe({
      next: (result) => {
        this.isSubmitting = false;

        if (!result.success) {
          this.errorMessage = result.message;
          return;
        }

        this.router.navigate(['/login'], { queryParams: { registered: '1' } });
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Registration failed. Please try again.';
      },
    });
  }

  showError(controlName: 'email' | 'password', errorKey: string): boolean {
    const control = this.form.controls[controlName];
    return control.hasError(errorKey) && (control.touched || control.dirty);
  }
}
