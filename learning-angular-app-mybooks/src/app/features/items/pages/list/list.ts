import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Book } from '../../../../core/models';
import { ApiObject } from '../../../../core/models/api-object.model';
import { BookService } from '../../../../core/services/book-service';
import { ApiObjectService } from '../../../../core/services/api-object-service';

@Component({
  selector: 'app-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  books$: Observable<Book[]>;
  totalBooks$: Observable<number>;
  currentlyReadingCount$: Observable<number>;
  upNextCount$: Observable<number>;
  finishedCount$: Observable<number>;

  objects: ApiObject[] = [];
  searchTerm = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  readonly pageSize = 5;

  isLoading = false;
  errorMessage = '';
  private deletingIds = new Set<string>();

  constructor(
    private apiObjectService: ApiObjectService,
    private bookService: BookService
  ) {
    this.books$ = this.bookService.books$;
    this.totalBooks$ = this.books$.pipe(map(books => books.length));
    this.currentlyReadingCount$ = this.books$.pipe(
      map(books => books.filter(book => book.readingStatus === 'Currently Reading').length)
    );
    this.upNextCount$ = this.books$.pipe(
      map(books => books.filter(book => book.readingStatus === 'Up Next').length)
    );
    this.finishedCount$ = this.books$.pipe(
      map(books => books.filter(book => book.readingStatus === 'Finished').length)
    );
  }

  ngOnInit(): void {
    this.loadObjects();
  }

  get filteredSortedObjects(): ApiObject[] {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();
    const filtered = this.objects.filter((item) =>
      this.getObjectName(item).toLowerCase().includes(normalizedSearch)
    );

    return [...filtered].sort((a, b) => {
      const comparison = this.getObjectName(a).localeCompare(this.getObjectName(b));
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  get paginatedObjects(): ApiObject[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredSortedObjects.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredSortedObjects.length / this.pageSize));
  }

  get canGoToPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  get canGoToNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  get hasNoResults(): boolean {
    return !this.isLoading && !this.errorMessage && this.filteredSortedObjects.length === 0;
  }

  onSearch(value: string): void {
    this.searchTerm = value;
    this.currentPage = 1;
  }

  setSortDirection(direction: 'asc' | 'desc'): void {
    this.sortDirection = direction;
    this.currentPage = 1;
  }

  previousPage(): void {
    if (this.canGoToPreviousPage) {
      this.currentPage -= 1;
    }
  }

  nextPage(): void {
    if (this.canGoToNextPage) {
      this.currentPage += 1;
    }
  }

  deleteObject(item: ApiObject): void {
    if (!window.confirm(`Are you sure you want to delete "${this.getObjectName(item) || 'this object'}"?`)) {
      return;
    }

    this.errorMessage = '';
    this.deletingIds.add(item.id);

    this.apiObjectService.deleteObjectById(item.id).subscribe({
      next: () => {
        this.objects = this.objects.filter((objectItem) => objectItem.id !== item.id);
        this.deletingIds.delete(item.id);
        this.ensurePageInBounds();
      },
      error: () => {
        this.errorMessage = 'Delete failed. Please try again.';
        this.deletingIds.delete(item.id);
      },
    });
  }

  isDeleting(id: string): boolean {
    return this.deletingIds.has(id);
  }

  trackById(_: number, item: ApiObject): string {
    return item.id;
  }

  retryLoad(): void {
    this.loadObjects();
  }

  private loadObjects(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiObjectService.getAllObjects().subscribe({
      next: (items) => {
        this.objects = items;
        this.isLoading = false;
        this.ensurePageInBounds();
      },
      error: () => {
        this.errorMessage = 'Unable to load objects right now. Please try again.';
        this.isLoading = false;
      },
    });
  }

  private ensurePageInBounds(): void {
    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  private getObjectName(item: ApiObject): string {
    return String(item.name ?? '');
  }
}
