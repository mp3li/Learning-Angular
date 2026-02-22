import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { Book } from '../../../../core/models';
import { ApiObject } from '../../../../core/models/api-object.model';
import { BookService } from '../../../../core/services/book-service';
import { ApiObjectService } from '../../../../core/services/api-object-service';
import { AppCardComponent } from '../../../../shared/components/app-card/app-card';

@Component({
  selector: 'app-detail',
  imports: [AppCardComponent, RouterLink, CommonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit {
  books$: Observable<Book[]>;
  objectItem: ApiObject | null = null;
  dataEntries: Array<{ key: string; value: string }> = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private apiObjectService: ApiObjectService,
    private bookService: BookService
  ) {
    this.books$ = this.bookService.books$.pipe(
      map(books => [...books].sort((a, b) => a.title.localeCompare(b.title)))
    );
  }

  ngOnInit(): void {
    this.loadObject();
    combineLatest([this.route.paramMap, this.books$]).subscribe(([params, books]) => {
      const id = params.get('id');
      if (!id) {
        return;
      }
      const exists = books.some(book => String(book.id) === id);
      if (exists) {
        this.scrollToBook(id);
      }
    });
  }

  retryLoad(): void {
    this.loadObject();
  }

  getSeriesPosition(book: Book): string {
    if (book.seriesNumber && book.seriesTotal) {
      return `${book.seriesNumber} of ${book.seriesTotal}`;
    }
    return '';
  }

  private loadObject(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Invalid item id.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.objectItem = null;
    this.dataEntries = [];

    this.apiObjectService.getObjectById(id).subscribe({
      next: (item) => {
        this.objectItem = item;
        this.dataEntries = this.buildDataEntries(item.data);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load object details. Please try again.';
        this.isLoading = false;
      },
    });
  }

  private buildDataEntries(data: Record<string, unknown> | null | undefined): Array<{ key: string; value: string }> {
    if (!data || Object.keys(data).length === 0) {
      return [];
    }

    return Object.entries(data).map(([key, value]) => ({
      key,
      value: this.formatValue(value),
    }));
  }

  private formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  }

  private scrollToBook(id: string): void {
    setTimeout(() => {
      const target = document.getElementById(`book-${id}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }
}
