import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { CreateEdit } from './create-edit';

describe('CreateEdit', () => {
  let component: CreateEdit;
  let fixture: ComponentFixture<CreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEdit],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
          },
        },
      ],
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
