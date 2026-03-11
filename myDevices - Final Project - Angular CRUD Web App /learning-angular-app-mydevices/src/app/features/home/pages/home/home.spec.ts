import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { ApiObjectService } from '../../../../core/services/api-object-service';
import { AuthService } from '../../../../core/services/auth-service';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            currentUser$: of(null),
          },
        },
        {
          provide: ApiObjectService,
          useValue: {
            getAllObjects: () => of([]),
            objectMutations$: EMPTY,
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
