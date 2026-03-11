import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTableComponent } from './app-table';

describe('AppTableComponent', () => {
  let component: AppTableComponent;
  let fixture: ComponentFixture<AppTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
