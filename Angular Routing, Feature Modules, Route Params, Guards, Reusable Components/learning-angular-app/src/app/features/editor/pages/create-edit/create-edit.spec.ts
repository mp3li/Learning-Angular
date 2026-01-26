import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEdit } from './create-edit';

describe('CreateEdit', () => {
  let component: CreateEdit;
  let fixture: ComponentFixture<CreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
