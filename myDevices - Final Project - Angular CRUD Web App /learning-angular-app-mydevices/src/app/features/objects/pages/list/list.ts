import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, finalize, map, of, timeout } from 'rxjs';
import { FALLBACK_OBJECTS } from '../../../../core/data/fallback-objects';
import { ApiObject } from '../../../../core/models/api-object.model';
import { ApiObjectService } from '../../../../core/services/api-object-service';

@Component({
  selector: 'app-objects-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class ObjectsListPage implements OnInit, OnDestroy {
  objects: ApiObject[] = [];
  searchTerm = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  readonly pageSize = 5;

  isRefreshing = false;
  statusMessage = '';
  statusTone: 'success' | 'warning' = 'success';
  showRetry = false;
  private deletingIds = new Set<string>();
  private loadFailSafeId: number | null = null;
  private statusClearId: number | null = null;
  private readonly fallbackObjects: ApiObject[] = FALLBACK_OBJECTS;

  constructor(
    private apiObjectService: ApiObjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Static-first rendering: show fallback data immediately, then refresh in background.
    this.objects = [...this.fallbackObjects];
    this.setStatus('Showing fallback objects while live API loads.', 'warning', false);
    this.loadObjects();
  }

  ngOnDestroy(): void {
    this.clearFailSafeTimer();
    this.clearStatusTimer();
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
    return this.filteredSortedObjects.length === 0;
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
    if (!window.confirm(`Delete "${this.getObjectName(item) || 'this object'}"? This action cannot be undone.`)) {
      return;
    }

    this.clearStatus();
    this.deletingIds.add(item.id);

    this.apiObjectService.deleteObjectById(item.id).subscribe({
      next: () => {
        this.objects = this.objects.filter((objectItem) => objectItem.id !== item.id);
        this.deletingIds.delete(item.id);
        this.ensurePageInBounds();
      },
      error: () => {
        this.setStatus('Delete failed. Please try again.', 'warning', true);
        this.deletingIds.delete(item.id);
      },
    });
  }

  isDeleting(id: string): boolean {
    return this.deletingIds.has(id);
  }

  getDataSummary(item: ApiObject): string {
    if (!item.data || Object.keys(item.data).length === 0) {
      return 'N/A';
    }

    const entries = Object.entries(item.data)
      .slice(0, 2)
      .map(([key, value]) => `${key}: ${String(value)}`);

    return entries.join(' | ');
  }

  trackById(_: number, item: ApiObject): string {
    return item.id;
  }

  retryLoad(): void {
    this.loadObjects();
  }

  private loadObjects(): void {
    this.isRefreshing = true;
    this.startFailSafeTimer();

    this.apiObjectService
      .getAllObjects()
      .pipe(
        timeout(8000),
        map((items) => this.normalizeObjects(items)),
        catchError(() => {
          this.setStatus('Live API unavailable. Showing fallback objects.', 'warning', true);
          return of(this.objects.length > 0 ? this.objects : this.fallbackObjects);
        }),
        finalize(() => {
          this.clearFailSafeTimer();
          this.isRefreshing = false;
        })
      )
      .subscribe({
        next: (items) => {
          this.objects = items;
          this.setStatus('Live API data loaded.', 'success', false, 2500);
          this.ensurePageInBounds();
          this.cdr.detectChanges();
        },
      });
  }

  private startFailSafeTimer(): void {
    this.clearFailSafeTimer();
    this.loadFailSafeId = window.setTimeout(() => {
      if (this.isRefreshing) {
        this.setStatus('Live API is taking too long. Showing fallback objects.', 'warning', true);
        if (this.objects.length === 0) {
          this.objects = [...this.fallbackObjects];
        }
        this.isRefreshing = false;
        this.ensurePageInBounds();
        this.cdr.detectChanges();
      }
    }, 9000);
  }

  private clearFailSafeTimer(): void {
    if (this.loadFailSafeId !== null) {
      window.clearTimeout(this.loadFailSafeId);
      this.loadFailSafeId = null;
    }
  }

  private clearStatusTimer(): void {
    if (this.statusClearId !== null) {
      window.clearTimeout(this.statusClearId);
      this.statusClearId = null;
    }
  }

  private clearStatus(): void {
    this.clearStatusTimer();
    this.statusMessage = '';
    this.showRetry = false;
  }

  private setStatus(
    message: string,
    tone: 'success' | 'warning',
    showRetry: boolean,
    autoClearMs?: number
  ): void {
    this.clearStatusTimer();
    this.statusMessage = message;
    this.statusTone = tone;
    this.showRetry = showRetry;

    if (autoClearMs && autoClearMs > 0) {
      this.statusClearId = window.setTimeout(() => {
        this.clearStatus();
        this.cdr.detectChanges();
      }, autoClearMs);
    }
  }

  private normalizeObjects(items: unknown): ApiObject[] {
    if (!Array.isArray(items)) {
      return [];
    }

    return items
      .filter((item): item is Partial<ApiObject> => !!item && typeof item === 'object')
      .map((item) => ({
        id: String(item.id ?? ''),
        name: String(item.name ?? ''),
        data: item.data && typeof item.data === 'object' ? item.data : null,
      }));
  }

  private ensurePageInBounds(): void {
    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  private getObjectName(item: ApiObject): string {
    return String(item?.name ?? '');
  }
}
