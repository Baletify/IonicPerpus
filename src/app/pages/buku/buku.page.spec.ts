import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BukuPage } from './buku.page';

describe('BukuPage', () => {
  let component: BukuPage;
  let fixture: ComponentFixture<BukuPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BukuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
