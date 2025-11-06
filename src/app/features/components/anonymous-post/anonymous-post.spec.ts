import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousPost } from './anonymous-post';

describe('AnonymousChat', () => {
  let component: AnonymousPost;
  let fixture: ComponentFixture<AnonymousPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnonymousPost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnonymousPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
