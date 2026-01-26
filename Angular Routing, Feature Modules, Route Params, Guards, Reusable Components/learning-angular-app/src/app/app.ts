import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <h1>Learning Angular App</h1>
        <ul class="nav-links">
          <li><a routerLink="/home" routerLinkActive="active">Home</a></li>
          <li><a routerLink="/items" routerLinkActive="active">Items</a></li>
          <li><a routerLink="/items/1" routerLinkActive="active">Item Detail (1)</a></li>
          <li><a routerLink="/create-edit" routerLinkActive="active">Create/Edit</a></li>
        </ul>
      </div>
    </nav>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.css'
})
export class App {}
