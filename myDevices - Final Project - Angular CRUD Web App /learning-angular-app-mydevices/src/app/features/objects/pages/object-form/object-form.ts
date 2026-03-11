import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiObjectPayload } from '../../../../core/models/api-object.model';
import { ApiObjectService } from '../../../../core/services/api-object-service';

@Component({
  selector: 'app-object-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './object-form.html',
  styleUrl: './object-form.css',
})
export class ObjectFormPage implements OnInit {
  objectId: string | null = null;
  isEditMode = false;

  isLoading = false;
  isSubmitting = false;
  useFullUpdate = false;

  errorMessage = '';
  successMessage = '';

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    color: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    price: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
    year: new FormControl<number | null>(null, {
      validators: [Validators.min(1970)],
    }),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiObjectService: ApiObjectService
  ) {}

  ngOnInit(): void {
    this.objectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.objectId;

    if (this.isEditMode && this.objectId) {
      this.loadObjectForEdit(this.objectId);
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    const payload = this.toPayload();

    if (!this.isEditMode) {
      this.apiObjectService.createObject(payload).subscribe({
        next: (created) => {
          this.isSubmitting = false;
          this.successMessage = 'Object created successfully.';
          this.router.navigate(['/objects', created.id]);
        },
        error: () => {
          this.isSubmitting = false;
          this.errorMessage = 'Create request failed. Please try again.';
        },
      });
      return;
    }

    if (!this.objectId) {
      this.isSubmitting = false;
      this.errorMessage = 'Invalid object id.';
      return;
    }

    const updateRequest = this.useFullUpdate
      ? this.apiObjectService.putObject(this.objectId, payload)
      : this.apiObjectService.patchObject(this.objectId, payload);

    updateRequest.subscribe({
      next: (updated) => {
        this.isSubmitting = false;
        this.successMessage = this.useFullUpdate
          ? 'Object updated using PUT.'
          : 'Object updated using PATCH.';
        this.router.navigate(['/objects', updated.id || this.objectId]);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Update request failed. Please try again.';
      },
    });
  }

  showError(controlName: 'name' | 'color' | 'price' | 'year', errorKey: string): boolean {
    const control = this.form.controls[controlName];
    return control.hasError(errorKey) && (control.touched || control.dirty);
  }

  private loadObjectForEdit(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiObjectService.getObjectById(id).subscribe({
      next: (item) => {
        this.form.patchValue({
          name: item.name ?? '',
          color: this.readStringData(item.data, 'color'),
          price: this.readNumberData(item.data, 'price'),
          year: this.readNumberData(item.data, 'year'),
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load the object for editing.';
        this.isLoading = false;
      },
    });
  }

  private toPayload(): ApiObjectPayload {
    const raw = this.form.getRawValue();

    const data: Record<string, unknown> = {
      color: raw.color.trim(),
      price: Number(raw.price ?? 0),
    };

    if (raw.year !== null && raw.year !== undefined && raw.year !== 0) {
      data['year'] = Number(raw.year);
    }

    return {
      name: raw.name.trim(),
      data,
    };
  }

  private readStringData(data: Record<string, unknown> | null, key: string): string {
    if (!data || data[key] === undefined || data[key] === null) {
      return '';
    }

    return String(data[key]);
  }

  private readNumberData(data: Record<string, unknown> | null, key: string): number | null {
    if (!data || data[key] === undefined || data[key] === null || data[key] === '') {
      return null;
    }

    const value = Number(data[key]);
    return Number.isFinite(value) ? value : null;
  }
}
