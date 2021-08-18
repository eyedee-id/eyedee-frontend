import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewConfideComponent } from './new-confide.component';

describe('NewConfideComponent', () => {
  let component: NewConfideComponent;
  let fixture: ComponentFixture<NewConfideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewConfideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewConfideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
