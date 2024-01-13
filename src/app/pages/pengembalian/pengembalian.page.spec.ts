import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PengembalianPage } from './pengembalian.page';

describe('PengembalianPage', () => {
  let component: PengembalianPage;
  let fixture: ComponentFixture<PengembalianPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PengembalianPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
