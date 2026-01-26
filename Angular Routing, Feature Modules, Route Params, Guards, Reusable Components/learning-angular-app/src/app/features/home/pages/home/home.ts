import { Component } from '@angular/core';
import { AppCardComponent } from '../../../../shared/components/app-card/app-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [AppCardComponent, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
