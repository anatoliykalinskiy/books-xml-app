import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BookService } from './book.service';
import { Book } from '../models/book.model';

const mockBooks: Book[] = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', pages: 180 },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', pages: 281 },
  { id: 3, title: '1984', author: 'George Orwell', pages: 328 },
]

describe('BookService', () => {
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookService]
    });
    service = TestBed.inject(BookService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers()
  });

  it('should initialize with signal default values', () => {
    expect(service.books()).toEqual([]);
    expect(service.searchQuery()).toBe('');
    expect(service.currentPage()).toBe(1);
    expect(service.pageSize()).toBe(5);
  });

  it('should correctly add a book with incremented ID via addBook()', () => {
    service.setBooks(mockBooks);
    service.addBook({ title: 'Pride and Prejudice', author: 'Jane Austen', pages: 279 });

    const currentBooks = service.books();
    expect(currentBooks.length).toBe(4);
    expect(currentBooks[3]).toEqual({
      id: 4,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      pages: 279
    });
  });

  it('should update a book by ID via updateBook()', () => {
    service.setBooks(mockBooks);
    const updatedBook: Book = { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', pages: 300 };

    service.updateBook(updatedBook);

    expect(service.books()[1]).toEqual(updatedBook);
  });

  it('should delete a book by ID and adjust the current page via deleteBook()', () => {
    service.setBooks(mockBooks);
    service.pageSize.set(1);
    service.currentPage.set(3);

    service.deleteBook(3);

    expect(service.books().length).toBe(2);
    expect(service.currentPage()).toBe(2);
  });

  describe('Filtering and Debounce (searchQuery)', () => {
    it('should not filter immediately and wait for 300ms debounce', () => {
      service.setBooks(mockBooks);
      service.searchQuery.set('Mock');

      vi.advanceTimersByTime(300);

      const filtered = service.filteredAndSortedBooks();
      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toBe('To Kill a Mockingbird');
    });
  });
});
