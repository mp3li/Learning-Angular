import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../models';

const initialBooks: Book[] = [
  {
    id: 1,
    title: 'Inkheart',
    author: 'Cornelia Funke',
    series: 'Inkheart',
    seriesNumber: 1,
    seriesTotal: 4,
    readingStatus: 'Currently Reading',
    genres: [],
  },
  {
    id: 2,
    title: 'Inkspell',
    author: 'Cornelia Funke',
    series: 'Inkheart',
    seriesNumber: 2,
    seriesTotal: 4,
    readingStatus: 'Up Next',
    genres: [],
  },
  {
    id: 3,
    title: 'Inkdeath',
    author: 'Cornelia Funke',
    series: 'Inkheart',
    seriesNumber: 3,
    seriesTotal: 4,
    readingStatus: 'Up Next',
    genres: [],
  },
];

@Injectable({ providedIn: 'root' })
export class BookService {
  private booksSubject = new BehaviorSubject<Book[]>(initialBooks);
  books$ = this.booksSubject.asObservable();

  addBook(book: Omit<Book, 'id'>): Book {
    const current = this.booksSubject.value;
    const nextId = current.length === 0 ? 1 : Math.max(...current.map(item => item.id)) + 1;
    const newBook: Book = { id: nextId, ...book };
    this.booksSubject.next([...current, newBook]);
    return newBook;
  }
}
