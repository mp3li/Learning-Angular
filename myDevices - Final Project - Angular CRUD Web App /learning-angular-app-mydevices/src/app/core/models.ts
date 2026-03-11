export interface User {
  id: number;
  name: string;
  email: string;
}

export type UserStatus = 'active' | 'inactive' | 'banned';

export type UserResponse =
  | { status: 'success'; user: User }
  | { status: 'error'; message: string };

export type ReadingStatus = 'Unread' | 'Up Next' | 'Currently Reading' | 'Finished';

export interface Book {
  id: number;
  title: string;
  author: string;
  series?: string;
  seriesNumber?: number | null;
  seriesTotal?: number | null;
  genres?: string[];
  readingStatus: ReadingStatus;
}

/*
I used an interface for User because it models a consistent object shape with named fields.
I used types for UserStatus and UserResponse because union values and union object variants are clearer with type aliases.
*/
