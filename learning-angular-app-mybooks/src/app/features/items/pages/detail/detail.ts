import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppCardComponent } from '../../../../shared/components/app-card/app-card';
import { CommonModule } from '@angular/common';
import { Book, BookService } from '../../../../core/services/book-service';
import { combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-detail',
  imports: [AppCardComponent, RouterLink, CommonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit {
  books$: Observable<Book[]>;

  constructor(private route: ActivatedRoute, private bookService: BookService) {
    this.books$ = this.bookService.books$.pipe(
      map(books => [...books].sort((a, b) => a.title.localeCompare(b.title)))
    );
  }

  ngOnInit() {
    combineLatest([this.route.paramMap, this.books$]).subscribe(([params, books]) => {
      const id = params.get('id');
      if (!id) {
        return;
      }
      const exists = books.some(book => String(book.id) === id);
      if (exists) {
        this.scrollToBook(id);
      }
    });
  }

  getSeriesPosition(book: Book): string {
    if (book.seriesNumber && book.seriesTotal) {
      return `${book.seriesNumber} of ${book.seriesTotal}`;
    }
    return '';
  }

  private scrollToBook(id: string) {
    setTimeout(() => {
      const target = document.getElementById(`book-${id}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }
}
