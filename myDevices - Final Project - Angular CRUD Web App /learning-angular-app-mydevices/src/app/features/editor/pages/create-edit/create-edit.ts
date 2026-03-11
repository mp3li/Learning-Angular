import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReadingStatus } from '../../../../core/models';
import { BookService } from '../../../../core/services/book-service';
import { delay, filter, map, of, take } from 'rxjs';

@Component({
  selector: 'app-create-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-edit.html',
  styleUrl: './create-edit.css',
})
export class CreateEdit implements OnInit {
  itemId: string | null = null;
  submitted = false;
  saveMessage = '';

  form = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), this.noWhitespaceValidator],
      asyncValidators: [this.titleTakenValidator()],
      updateOn: 'blur',
    }),
    author: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    readingStatus: new FormControl<ReadingStatus>('Unread', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    series: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    seriesNumber: new FormControl<number | null>(null, {
      validators: [Validators.min(1)],
    }),
    seriesTotal: new FormControl<number | null>(null, {
      validators: [Validators.min(1)],
    }),
    genres: new FormArray<FormControl<string>>(
      [new FormControl<string>('', { nonNullable: true })]
    ),
  });

  constructor(private route: ActivatedRoute, private bookService: BookService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id');
    });
  }

  get genres(): FormArray<FormControl<string>> {
    return this.form.get('genres') as FormArray<FormControl<string>>;
  }

  addGenre() {
    this.genres.push(new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }));
  }

  removeGenre(index: number) {
    if (this.genres.length > 0) {
      this.genres.removeAt(index);
    }
  }

  showError(controlName: string, errorKey: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.hasError(errorKey) && (control.touched || this.submitted);
  }

  onSubmit() {
    this.submitted = true;
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.pending) {
      this.form.statusChanges
        .pipe(filter(status => status !== 'PENDING'), take(1))
        .subscribe(() => this.finishSubmit());
      return;
    }
    this.finishSubmit();
  }

  private finishSubmit() {
    if (this.form.invalid) {
      return;
    }
    const rawValue = this.form.getRawValue();
    const genres = (rawValue.genres ?? [])
      .map(value => value.trim())
      .filter(value => value.length > 0);
    const newBook = this.bookService.addBook({
      title: rawValue.title.trim(),
      author: rawValue.author.trim(),
      series: rawValue.series.trim() || undefined,
      seriesNumber: rawValue.seriesNumber ?? null,
      seriesTotal: rawValue.seriesTotal ?? null,
      genres,
      readingStatus: rawValue.readingStatus,
    });
    console.log('Form value', newBook);
    this.saveMessage = `Added "${newBook.title}" to myBooks.`;
    window.setTimeout(() => {
      this.saveMessage = '';
    }, 2500);
    this.resetForm();
  }

  private resetForm() {
    this.form.reset({
      title: '',
      author: '',
      readingStatus: 'Unread',
      series: '',
      seriesNumber: null,
      seriesTotal: null,
      genres: [],
    });
    this.genres.clear();
    this.addGenre();
    this.submitted = false;
  }

  private noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value ?? '');
    return value.trim().length === 0 ? { whitespace: true } : null;
  }

  private titleTakenValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const value = String(control.value ?? '').trim().toLowerCase();
      if (!value) {
        return of(null);
      }
      return of(value).pipe(
        delay(400),
        map((title) => (title === 'taken' || title === 'existing' ? { titleTaken: true } : null))
      );
    };
  }
}
