import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookService} from '../../services/book.service';
import {Book} from '../../models/book.model';

@Component({
  selector: 'app-reader-xml-file',
  imports: [CommonModule],
  templateUrl: './file-reader.html',
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

    reader.onload = (e) => {
      const xmlText = e.target?.result as string;
      if (xmlText) {
        this.parseXml(xmlText);
      }
    };

    reader.readAsText(file);
  }

  private validate(elms: HTMLCollectionOf<Element>) {
    if (elms.length > 0) throw new Error("XML pars error");
  }

  private parseXml(xmlText: string): void {
    try {
      const xmlDoc = new DOMParser().parseFromString(xmlText, 'text/xml');

      this.validate(xmlDoc.getElementsByTagName('parsererror'));
      const bookElements = xmlDoc.getElementsByTagName('book');

      const parsedBooks: Book[] = Array.from(bookElements).map(bookEl => ({
        id: Number(bookEl.getAttribute('id') || 0),
        title: bookEl.getElementsByTagName('title')?.[0]?.textContent || 'Untitled',
        author: bookEl.getElementsByTagName('author')?.[0]?.textContent || 'Unknown',
        pages: Number(bookEl.getElementsByTagName('pages')?.[0]?.textContent || 0)
      }));

      this.bookService.setBooks(parsedBooks);

    } catch (error) {
      alert('Failed to parse XML. Please check the file structure.');
    }
  }
}
