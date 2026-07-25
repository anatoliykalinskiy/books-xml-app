import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {validateXML, XMLValidationError, XMLValidationResult} from 'xmllint-wasm';
import {BookService} from '../../services/book.service';
import {Book} from '../../models/book.model';
import {xsdSchema} from '../../utils/book-utils';

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

    reader.onload = async (e) => {
      const xmlText = e.target?.result as string;
      const xmlDoc: Document = new DOMParser().parseFromString(xmlText, 'text/xml');

      if (!this.validateXml(xmlDoc)) return;

      const validateResult = await this.validateXmlStructure(xmlText);

      if (validateResult.valid) this.parseXml(xmlDoc);
    };

    reader.readAsText(file);
  }

  private parseXml(xmlDoc: Document): void {
    try {
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

  private validateXml(xmlDoc: Document): boolean | undefined {
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) throw new Error("XML pars error");

    return true;
  }

  private async validateXmlStructure(xmlContent: string): Promise<{ valid: boolean; errors: XMLValidationError[]  }> {
    try {
      const result: XMLValidationResult = await validateXML({
        xml: xmlContent,
        schema: xsdSchema
      });

      return {
        valid: result.valid,
        errors: []
      };
    } catch (error: any) {
      return {
        valid: false,
        errors: [error?.message || 'Critical error parsing file']
      };
    }
  }
}
