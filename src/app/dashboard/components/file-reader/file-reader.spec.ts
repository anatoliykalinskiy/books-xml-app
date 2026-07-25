import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileReader } from './file-reader';

describe('FileReader', () => {
  let component: FileReader;
  let fixture: ComponentFixture<FileReader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileReader],
    }).compileComponents();

    fixture = TestBed.createComponent(FileReader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
