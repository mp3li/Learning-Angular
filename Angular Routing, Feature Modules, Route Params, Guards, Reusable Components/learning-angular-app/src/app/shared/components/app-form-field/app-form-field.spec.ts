import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFormField } from './app-form-field';

describe('AppFormField', () => {
  let component: AppFormField;
  let fixture: ComponentFixture<AppFormField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFormField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFormField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
