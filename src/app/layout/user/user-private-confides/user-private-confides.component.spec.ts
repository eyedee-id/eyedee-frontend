import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPrivateConfidesComponent } from './user-private-confides.component';

describe('UserPrivateConfidesComponent', () => {
  let component: UserPrivateConfidesComponent;
  let fixture: ComponentFixture<UserPrivateConfidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPrivateConfidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPrivateConfidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
