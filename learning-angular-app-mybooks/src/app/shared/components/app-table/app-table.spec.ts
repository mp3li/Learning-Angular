import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTable } from './app-table';

describe('AppTable', () => {
  let component: AppTable;
  let fixture: ComponentFixture<AppTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
