import { Component, OnInit } from '@angular/core';
import { AppFormFieldComponent } from '../../../../shared/components/app-form-field/app-form-field';
import { AppCardComponent } from '../../../../shared/components/app-card/app-card';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-edit',
  imports: [AppFormFieldComponent, AppCardComponent, RouterLink, FormsModule],
  templateUrl: './create-edit.html',
  styleUrl: './create-edit.css',
})
export class CreateEdit implements OnInit {
  itemId: string | null = null;
  form = {
    name: '',
    description: '',
    status: 'Active'
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id');
      if (this.itemId) {
        // In a real app, load item data from a service
        this.form = {
          name: `Item ${this.itemId}`,
          description: `Description for item ${this.itemId}`,
          status: 'Active'
        };
      }
    });
  }

  onSubmit() {
    console.log('Form submitted:', this.form);
    this.router.navigate(['/items']);
  }
}
