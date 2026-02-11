import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewWellnessTest } from './review-wellness-test';

describe('ReviewWellnessTest', () => {
  let component: ReviewWellnessTest;
  let fixture: ComponentFixture<ReviewWellnessTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewWellnessTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewWellnessTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
