import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ELearning } from './e-learning';

describe('ELearning', () => {
  let component: ELearning;
  let fixture: ComponentFixture<ELearning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ELearning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ELearning);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
