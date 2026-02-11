import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAnonymousPost } from './review-anonymous-post';

describe('ReviewAnonymousPost', () => {
  let component: ReviewAnonymousPost;
  let fixture: ComponentFixture<ReviewAnonymousPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewAnonymousPost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewAnonymousPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
