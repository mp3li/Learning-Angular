import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { auditTime, catchError, map, Observable, of, Subject, take, takeUntil, timeout } from 'rxjs';
import { FALLBACK_OBJECTS } from '../../../../core/data/fallback-objects';
import { AuthUser } from '../../../../core/models/auth.model';
import { ApiObjectService } from '../../../../core/services/api-object-service';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  currentUser$: Observable<AuthUser | null>;
  objectsCount = FALLBACK_OBJECTS.length;
  isLoadingStats = false;
  statsMessage = '';
  private readonly fallbackObjectCount = FALLBACK_OBJECTS.length;
  private readonly destroy$ = new Subject<void>();
  private statusClearId: number | null = null;
  private loadingGuardId: number | null = null;
  private refreshQueued = false;

  constructor(
    private authService: AuthService,
    private apiObjectService: ApiObjectService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.statsMessage = '';
    this.loadStats();
    this.apiObjectService.objectMutations$
      .pipe(
        auditTime(250),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadStats();
      });
  }

  private loadStats(): void {
    if (this.isLoadingStats) {
      this.refreshQueued = true;
      return;
    }

    this.isLoadingStats = true;
    this.startLoadingGuard();

    this.apiObjectService
      .getAllObjects()
      .pipe(
        timeout(8000),
        take(1),
        map((objects) => ({
          count: Array.isArray(objects) ? objects.length : this.fallbackObjectCount,
          isLive: true,
        })),
        catchError(() => of({ count: this.fallbackObjectCount, isLive: false })),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (result) => {
          this.objectsCount = result.count;
          if (result.isLive) {
            this.setStatsMessage('Live stats loaded.', 2500);
          } else {
            this.setStatsMessage('Live stats unavailable. Showing fallback count.');
          }
          this.finishLoading();
        },
        error: () => {
          this.objectsCount = this.fallbackObjectCount;
          this.setStatsMessage('Live stats unavailable. Showing fallback count.');
          this.finishLoading();
        },
      });
  }

  ngOnDestroy(): void {
    this.clearLoadingGuard();
    this.clearStatusTimer();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startLoadingGuard(): void {
    this.clearLoadingGuard();
    this.loadingGuardId = window.setTimeout(() => {
      if (this.isLoadingStats) {
        this.objectsCount = this.fallbackObjectCount;
        this.setStatsMessage('Live stats timed out. Showing fallback count.');
        this.finishLoading();
      }
    }, 9000);
  }

  private clearLoadingGuard(): void {
    if (this.loadingGuardId !== null) {
      window.clearTimeout(this.loadingGuardId);
      this.loadingGuardId = null;
    }
  }

  private finishLoading(): void {
    this.clearLoadingGuard();
    this.isLoadingStats = false;
    if (this.refreshQueued) {
      this.refreshQueued = false;
      this.loadStats();
    }
  }

  private clearStatusTimer(): void {
    if (this.statusClearId !== null) {
      window.clearTimeout(this.statusClearId);
      this.statusClearId = null;
    }
  }

  private setStatsMessage(message: string, autoClearMs?: number): void {
    this.clearStatusTimer();
    this.statsMessage = message;

    if (autoClearMs && autoClearMs > 0) {
      this.statusClearId = window.setTimeout(() => {
        this.statsMessage = '';
      }, autoClearMs);
    }
  }
}
