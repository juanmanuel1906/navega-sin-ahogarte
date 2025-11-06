import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellnessTestPanel } from './wellness-test-panel';

describe('WellnessTestPanel', () => {
  let component: WellnessTestPanel;
  let fixture: ComponentFixture<WellnessTestPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WellnessTestPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WellnessTestPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
