import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../../../../core/models';
import { BookService } from '../../../../core/services/book-service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  books$: Observable<Book[]>;
  totalBooks$: Observable<number>;
  currentlyReadingCount$: Observable<number>;
  upNextCount$: Observable<number>;
  finishedCount$: Observable<number>;

  constructor(private bookService: BookService) {
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
}
