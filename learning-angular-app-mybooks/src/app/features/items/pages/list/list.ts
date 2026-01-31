import { Component } from '@angular/core';
import { AppTableComponent } from '../../../../shared/components/app-table/app-table';
import { Router, RouterLink } from '@angular/router';
import { Book, BookService } from '../../../../core/services/book-service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [AppTableComponent, RouterLink, CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  headers = ['ID', 'Title', 'Author', 'Series', 'Series Position', 'Reading Status'];
  rows$: Observable<Record<string, unknown>[]>;

  constructor(private router: Router, private bookService: BookService) {
    this.rows$ = this.bookService.books$.pipe(map(books => books.map(book => this.toRow(book))));
  }

  openDetail(row: Record<string, unknown>) {
    const id = row['ID'];
    if (typeof id === 'number' || typeof id === 'string') {
      this.router.navigate(['/items', id]);
    }
  }

  private toRow(book: Book): Record<string, unknown> {
    return {
      ID: book.id,
      Title: book.title,
      Author: book.author,
      Series: book.series ?? '',
      'Series Position': this.getSeriesPosition(book),
      'Reading Status': book.readingStatus,
    };
  }

  private getSeriesPosition(book: Book): string {
    if (book.seriesNumber && book.seriesTotal) {
      return `${book.seriesNumber} of ${book.seriesTotal}`;
    }
    return '';
  }
}
