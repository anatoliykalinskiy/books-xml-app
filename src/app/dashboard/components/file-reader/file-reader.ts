import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookService} from '../../services/book.service';
import {Book} from '../../models/book.model';

@Component({
  selector: 'app-reader-xml-file',
  imports: [CommonModule],
  templateUrl: './file-reader.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReaderXmlFile {
  private bookService = inject(BookService);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const xmlText = e.target?.result as string;
      const xmlDoc: Document = new DOMParser().parseFromString(xmlText, 'text/xml');

      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        alert('Failed to parse XML.');
        return;
      }

      this.parseXml(xmlDoc);
    };

    reader.readAsText(file);
  }

  private parseXml(xmlDoc: Document): void {
    const bookElements = xmlDoc.getElementsByTagName('book');

    if (!bookElements || !bookElements.length) this.alertXmlParsError();

    const books: Book[] = [];

    Array.from(bookElements).map(bookEl => {
      const id = bookEl.getAttribute('id');
      const title = bookEl.getElementsByTagName('title');
      const author = bookEl.getElementsByTagName('author');
      const pages = bookEl.getElementsByTagName('pages');

      if (!id || !title || !author || !pages) {
        this.alertXmlParsError();
        return;
      }

      const book: Book =
      {
        id: Number(id || 0),
        title: title[0]?.textContent || 'Untitled',
        author: author[0]?.textContent || 'Unknown',
        pages: Number(pages[0]?.textContent || 0)
      }

      books.push(book);
    });

    this.bookService.setBooks(books);
  }

  alertXmlParsError() {
    alert('Failed to parse XML. Please check the file structure.');
  }
}
