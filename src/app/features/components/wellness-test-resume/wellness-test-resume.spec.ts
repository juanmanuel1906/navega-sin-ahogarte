import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellnessTestResume } from './wellness-test-resume';

describe('WellnessTestResume', () => {
  let component: WellnessTestResume;
  let fixture: ComponentFixture<WellnessTestResume>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WellnessTestResume]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WellnessTestResume);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
