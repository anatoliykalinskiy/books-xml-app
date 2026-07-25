import {ChangeDetectionStrategy, Component, inject, signal, viewChild} from '@angular/core';
import {ReaderXmlFile} from './components/file-reader/file-reader';
import {BookDisplay} from './components/book-display/book-display';
import {FileDownloader} from './components/file-downloader/file-downloader';
import {BookForm} from './components/book-form/book-form';
import {Book, BookAction, BookActionPayloads} from './models/book.model';
import {BookService} from './services/book.service';
import {AuthService} from '../core/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReaderXmlFile, BookDisplay, FileDownloader, BookForm],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  public bookService = inject(BookService);
  public authService = inject(AuthService);
  bookFormDialog = viewChild.required(BookForm);
  selectedBook = signal<Book | null>(null);

  executeAction(action: BookAction, payload: BookActionPayloads[BookAction]): void {
    if (action !== BookAction.None) {
      switch (action) {
        case BookAction.Add:
          this.bookService.addBook(payload as BookActionPayloads[BookAction.Add]);
          break;
        case BookAction.Update:
          this.bookService.updateBook(payload as BookActionPayloads[BookAction.Update]);
          break;
        case BookAction.Delete:
          this.bookService.deleteBook(payload as BookActionPayloads[BookAction.Delete]);
          break;
        default:
          break;
      }
    }

    this.selectedBook.set(null);
  }

  onEditRequested(book: Book): void {
    this.selectedBook.set(book);
  }

  addBook(): void {
    this.bookFormDialog().openCreateDialog();
  }
}
