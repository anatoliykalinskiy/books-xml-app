import {Injectable, signal, computed, debounced} from '@angular/core';
import { Book, SortDirection } from '../models/book.model';
import { createBookComparator, escapeXml } from '../utils/book-utils';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private _books = signal<Book[]>([]);
  readonly books = this._books.asReadonly();

  readonly searchQuery = signal<string>('');
  private readonly _debouncedQuery = debounced(this.searchQuery, 300);
  readonly sortDirection = signal<SortDirection>(SortDirection.None);
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(5);

  readonly filteredAndSortedBooks = computed(() => {
    let result = [...this._books()];
    const query = this._debouncedQuery.value().trim().toLowerCase();
    const direction = this.sortDirection();

    if (query) {
      result = result.filter(book => book.title.toLowerCase().includes(query));
    }
    if (direction !== SortDirection.None) {
      result.sort(createBookComparator(direction));
    }
    return result;
  });

  readonly paginatedBooks = computed(() => {
    const sourceArray = this.filteredAndSortedBooks();
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return sourceArray.slice(startIndex, startIndex + this.pageSize());
  });

  readonly totalPages = computed(() => {
    const count = this.filteredAndSortedBooks().length;
    return Math.ceil(count / this.pageSize()) || 1;
  });

  setBooks(books: Book[]): void {
    this._books.set(books);
    this.resetPagination();
  }

  addBook(book: Omit<Book, 'id'>): void {
    this._books.update(books => {
      const maxId = books.reduce((max, item) => item.id > max ? item.id : max, 0);
      return [...books, { ...book, id: maxId + 1 }];
    });
  }

  updateBook(updatedBook: Book): void {
    this._books.update(books => books.map(b => b.id === updatedBook.id ? updatedBook : b));
  }

  deleteBook(id: number): void {
    this._books.update(books => books.filter(b => b.id !== id));
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(this.totalPages());
    }
  }

  resetPagination(): void { this.currentPage.set(1); }

  exportToXmlString(): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<library>\n';
    this._books().forEach(book => {
      xml += `  <book id="${book.id}">\n    <title>${escapeXml(book.title)}</title>\n    <author>${escapeXml(book.author)}</author>\n    <pages>${book.pages}</pages>\n  </book>\n`;
    });
    return xml + '</library>';
  }
}
