import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppCardComponent } from '../../../../shared/components/app-card/app-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail',
  imports: [AppCardComponent, RouterLink, CommonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit {
  itemId: string | null = null;
  item: any = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id');
      // Sample data - in a real app this would come from a service
      this.item = {
        id: this.itemId,
        name: `Item ${this.itemId}`,
        description: `This is a detailed view of item ${this.itemId}`,
        status: 'Active',
        createdDate: new Date().toLocaleDateString()
      };
    });
  }
}
