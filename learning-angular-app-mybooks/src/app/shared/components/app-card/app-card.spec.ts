import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCard } from './app-card';

describe('AppCard', () => {
  let component: AppCard;
  let fixture: ComponentFixture<AppCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
