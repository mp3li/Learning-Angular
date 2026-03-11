import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiObject } from '../../../../core/models/api-object.model';
import { ApiObjectService } from '../../../../core/services/api-object-service';

@Component({
  selector: 'app-object-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ObjectDetailPage implements OnInit {
  objectItem: ApiObject | null = null;
  dataEntries: Array<{ key: string; value: string }> = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private apiObjectService: ApiObjectService
  ) {}

  ngOnInit(): void {
    this.loadObject();
  }

  retryLoad(): void {
    this.loadObject();
  }

  private loadObject(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Invalid object id.';
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
}
