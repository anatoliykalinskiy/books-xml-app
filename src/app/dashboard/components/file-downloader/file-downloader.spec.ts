import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDownloader } from './file-downloader';

describe('FileDownloader', () => {
  let component: FileDownloader;
  let fixture: ComponentFixture<FileDownloader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDownloader],
    }).compileComponents();

    fixture = TestBed.createComponent(FileDownloader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
