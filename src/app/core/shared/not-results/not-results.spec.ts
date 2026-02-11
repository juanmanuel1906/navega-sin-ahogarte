import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotResults } from './not-results';

describe('NotResults', () => {
  let component: NotResults;
  let fixture: ComponentFixture<NotResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
