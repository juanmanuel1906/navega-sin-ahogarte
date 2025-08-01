import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellnessTest } from './wellness-test';

describe('WellnessTest', () => {
  let component: WellnessTest;
  let fixture: ComponentFixture<WellnessTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WellnessTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WellnessTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
