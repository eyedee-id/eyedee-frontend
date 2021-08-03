import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfideComponent } from './confide.component';

describe('ConfideComponent', () => {
  let component: ConfideComponent;
  let fixture: ComponentFixture<ConfideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
