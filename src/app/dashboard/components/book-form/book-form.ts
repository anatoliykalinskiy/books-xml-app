import {Component, input, effect, signal, viewChild, ElementRef, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {form, FormField, required, min} from '@angular/forms/signals';
import {Book, BookAction, BookActionPayloads} from '../../models/book.model';

type BookFormData = Omit<Book, 'id'>;

@Component({
  selector: 'app-book-form',
  imports: [CommonModule, FormField],
  templateUrl: './book-form.html',
})
export class BookForm {
  private dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('formDialog');
  bookToEdit = input<Book | null>(null);

  protected readonly BookAction = BookAction;
  formSubmitted = output<{ action: BookAction; payload: BookActionPayloads[BookAction]; }>();

  private readonly initialValue: BookFormData = {title: '', author: '', pages: 0};
  formModel = signal<BookFormData>({...this.initialValue});

  bookForm = form(this.formModel, (schemaPath) => {
    required(schemaPath.title);
    required(schemaPath.author);
    required(schemaPath.pages);
    min(schemaPath.pages, 1);
  });

  isEditMode = signal(false);
  currentId = signal<number | null>(null);

  constructor() {
    effect(() => {
      const book = this.bookToEdit();
      const nativeDialog = this.dialogEl().nativeElement;
      if (book) {
        this.currentId.set(book.id);
        this.isEditMode.set(true);
        this.formModel.set(book);
        if (!nativeDialog.open) nativeDialog.showModal();
      } else {
        this.isEditMode.set(false);
        this.resetFormState();
      }
    });
  }

  openCreateDialog(): void {
    this.resetFormState();
    const nativeDialog = this.dialogEl().nativeElement;
    if (!nativeDialog.open) nativeDialog.showModal();
  }

  saveBook(event: Event): void {
    event.preventDefault();
    const rawData = this.formModel();
    const data = {title: rawData.title, author: rawData.author, pages: Number(rawData.pages)};
    const action = this.isEditMode() ? BookAction.Update : BookAction.Add;
    const payload = this.isEditMode() && this.currentId() !== null ? {id: this.currentId()!, ...data} : data;
    this.onNativeDialogClosed(action, payload);
  }

  onNativeDialogClosed<K extends BookAction>(action: K, payload: BookActionPayloads[K]): void {
    this.formSubmitted.emit({action, payload: payload as BookActionPayloads[BookAction.Add] | BookActionPayloads[BookAction.Update]});
    const nativeDialog = this.dialogEl().nativeElement;
    if (nativeDialog.open) nativeDialog.close();
  }

  private resetFormState(): void {
    if (this.isEditMode()) this.currentId.set(null);
    this.bookForm().reset({...this.initialValue});
  }
}
