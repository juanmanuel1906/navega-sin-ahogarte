import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallToActionLanding } from './call-to-action-landing';

describe('CallToActionLanding', () => {
  let component: CallToActionLanding;
  let fixture: ComponentFixture<CallToActionLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallToActionLanding]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallToActionLanding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
