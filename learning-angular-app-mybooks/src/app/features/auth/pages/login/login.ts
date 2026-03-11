import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  isSubmitting = false;
  errorMessage = '';
  infoMessage = '';

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
    private router: Router,
    private route: ActivatedRoute
  ) {
    const wasRegistered = this.route.snapshot.queryParamMap.get('registered');
    if (wasRegistered === '1') {
      this.infoMessage = 'Registration complete. Please sign in.';
    }

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/items']);
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    const email = this.form.controls.email.value.trim();
    const password = this.form.controls.password.value;

    this.authService.login(email, password).subscribe({
      next: (result) => {
        this.isSubmitting = false;

        if (!result.success) {
          this.errorMessage = result.message;
          return;
        }

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl || '/items');
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Login failed. Please try again.';
      },
    });
  }

  showError(controlName: 'email' | 'password', errorKey: string): boolean {
    const control = this.form.controls[controlName];
    return control.hasError(errorKey) && (control.touched || control.dirty);
  }
}
