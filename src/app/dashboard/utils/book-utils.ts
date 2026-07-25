import { Book, SortDirection } from '../models/book.model';

export function createBookComparator(direction: SortDirection.Asc | SortDirection.Desc): (a: Book, b: Book) => number {
  const modifier = direction === SortDirection.Asc ? 1 : -1;
  return (a: Book, b: Book): number => {
    const authorA = a.author.toLowerCase();
    const authorB = b.author.toLowerCase();
    if (authorA < authorB) return -1 * modifier;
    if (authorA > authorB) return 1 * modifier;

    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    if (titleA < titleB) return -1 * modifier;
    if (titleA > titleB) return 1 * modifier;
    return 0;
  };
}

export function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'; case '>': return '&gt;'; case '&': return '&amp;';
      case '\'': return '&apos;'; case '"': return '&quot;'; default: return c;
    }
  });
}

export const xsdSchema = `<?xml version="1.0" encoding="UTF-8"?>
    <xs:schema xmlns:xs="http://w3.org">
      <xs:element name="library">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="book" maxOccurs="unbounded" minOccurs="0">
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="title" type="xs:string"/>
                  <xs:element name="author" type="xs:string"/>
                  <xs:element name="pages" type="xs:positiveInteger"/>
                </xs:sequence>
                <xs:attribute name="id" type="xs:positiveInteger" use="required"/>
              </xs:complexType>
            </xs:element>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    </xs:schema>`;
