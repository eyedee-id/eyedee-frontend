import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConfidesComponent } from './user-confides.component';

describe('UserConfidesComponent', () => {
  let component: UserConfidesComponent;
  let fixture: ComponentFixture<UserConfidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserConfidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConfidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
