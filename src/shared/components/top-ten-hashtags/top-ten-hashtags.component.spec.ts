import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTenHashtagsComponent } from './top-ten-hashtags.component';

describe('TopTenHashtagsComponent', () => {
  let component: TopTenHashtagsComponent;
  let fixture: ComponentFixture<TopTenHashtagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopTenHashtagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopTenHashtagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
