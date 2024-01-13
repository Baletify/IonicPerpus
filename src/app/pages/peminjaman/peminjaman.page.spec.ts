import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeminjamanPage } from './peminjaman.page';

describe('PeminjamanPage', () => {
  let component: PeminjamanPage;
  let fixture: ComponentFixture<PeminjamanPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PeminjamanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
