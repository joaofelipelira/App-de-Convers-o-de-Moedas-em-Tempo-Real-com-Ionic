import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConversorPage } from './conversor.page';

describe('ConversorPage', () => {
  let component: ConversorPage;
  let fixture: ComponentFixture<ConversorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
