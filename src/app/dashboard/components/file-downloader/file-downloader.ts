import {Component, inject, computed, ChangeDetectionStrategy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookService} from '../../services/book.service';

@Component({
  selector: 'app-file-downloader',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [disabled]="isDisabled()"
      (click)="downloadXml()"
      class="px-4 py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-emerald-700
      disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:shadow-none
      disabled:cursor-not-allowed border border-transparent transition-all cursor-pointer">
      Download Current XML
    </button>
  `
})
export class FileDownloader {
  private bookService = inject(BookService);

  // Сигнал блокировки: если книг нет — скачивание недоступно
  isDisabled = computed(() => this.bookService.books().length === 0);

  downloadXml(): void {
    const xmlContent = this.bookService.exportToXmlString();

    const blob = new Blob([xmlContent], {type: 'application/xml;charset=utf-8;'});
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'library_export.xml');

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
