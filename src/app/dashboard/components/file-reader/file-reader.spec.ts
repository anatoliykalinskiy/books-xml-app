import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderXmlFile } from './file-reader';

describe('ReaderXmlFile', () => {
  let component: ReaderXmlFile;
  let fixture: ComponentFixture<ReaderXmlFile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReaderXmlFile],
    }).compileComponents();

    fixture = TestBed.createComponent(ReaderXmlFile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
