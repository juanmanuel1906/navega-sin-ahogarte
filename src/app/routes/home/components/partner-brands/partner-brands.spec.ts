import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerBrands } from './partner-brands';

describe('PartnerBrands', () => {
  let component: PartnerBrands;
  let fixture: ComponentFixture<PartnerBrands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerBrands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerBrands);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
