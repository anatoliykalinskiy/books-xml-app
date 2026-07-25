import {ChangeDetectionStrategy, Component, computed, inject, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Book, SortDirection, BookAction, BookActionPayloads} from '../../models/book.model';
import {BookService} from '../../services/book.service';
import {AuthService} from '../../../core/auth.service';

@Component({
  selector: 'app-book-display',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-display.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDisplay {
  public bookService = inject(BookService);
  public authService = inject(AuthService);
  editRequest = output<Book>();
  deleteRequest = output<{ action: BookAction.Delete; payload: BookActionPayloads[BookAction.Delete] }>();
  books = computed(() => this.bookService.paginatedBooks());

  onDeleteClicked(id: number): void {
    this.deleteRequest.emit({action: BookAction.Delete, payload: id});
  }

  onSearchChanged(query: string): void {
    this.bookService.searchQuery.set(query);
    this.bookService.resetPagination();
  }

  onPageChanged(page: number): void {
    this.bookService.currentPage.set(page);
  }

  onSortToggled(): void {
    const current = this.bookService.sortDirection();

    switch (true) {
      case current === SortDirection.None:
        this.bookService.sortDirection.set(SortDirection.Asc);
        break;
      case current === SortDirection.Asc:
        this.bookService.sortDirection.set(SortDirection.Desc);
        break;
      default:
        this.bookService.sortDirection.set(SortDirection.None);
        break;
    }

    this.bookService.resetPagination();
  }

  getSortLabel(): string {
    const current = this.bookService.sortDirection();
    return current === SortDirection.Asc ? 'A-Z ▲' : current === SortDirection.Desc ? 'Z-A ▼' : 'None';
  }

  searchQuery(): string {
    return this.bookService.searchQuery();
  }
}
