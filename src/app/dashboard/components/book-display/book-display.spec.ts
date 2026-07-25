import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDisplay } from './book-display';

describe('BookDisplay', () => {
  let component: BookDisplay;
  let fixture: ComponentFixture<BookDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(BookDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
