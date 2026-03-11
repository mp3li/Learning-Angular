import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFormFieldComponent } from './app-form-field';

describe('AppFormFieldComponent', () => {
  let component: AppFormFieldComponent;
  let fixture: ComponentFixture<AppFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFormFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFormFieldComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
