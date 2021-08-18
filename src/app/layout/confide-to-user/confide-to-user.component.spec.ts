import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfideToUserComponent } from './confide-to-user.component';

describe('ConfideToUserComponent', () => {
  let component: ConfideToUserComponent;
  let fixture: ComponentFixture<ConfideToUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfideToUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfideToUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
