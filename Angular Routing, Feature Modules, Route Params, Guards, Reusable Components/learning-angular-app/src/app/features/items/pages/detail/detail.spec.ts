import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detail } from './detail';

describe('Detail', () => {
  let component: Detail;
  let fixture: ComponentFixture<Detail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
