import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavLanding } from './nav-landing';

describe('NavLanding', () => {
  let component: NavLanding;
  let fixture: ComponentFixture<NavLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavLanding]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavLanding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
