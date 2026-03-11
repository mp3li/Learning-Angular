import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { ApiObjectService } from '../../../../core/services/api-object-service';

import { List } from './list';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [List],
      providers: [
        provideRouter([]),
        {
          provide: ApiObjectService,
          useValue: {
            getAllObjects: () => of([]),
            deleteObjectById: () => of(undefined),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
