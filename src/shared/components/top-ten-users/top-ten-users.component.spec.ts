import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTenUsersComponent } from './top-ten-users.component';

describe('TopTenUsersComponent', () => {
  let component: TopTenUsersComponent;
  let fixture: ComponentFixture<TopTenUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopTenUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopTenUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
