export interface Book {
  id: number;
  title: string;
  author: string;
  pages: number;
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
  None = 'none'
}

export enum BookAction {
  Add = 'addBook',
  Update = 'updateBook',
  Delete = 'deleteBook',
  None = 'none'
}

export interface BookActionPayloads {
  [BookAction.Add]: Omit<Book, 'id'>;
  [BookAction.Update]: Book;
  [BookAction.Delete]: number;
  [BookAction.None]: null;
}
