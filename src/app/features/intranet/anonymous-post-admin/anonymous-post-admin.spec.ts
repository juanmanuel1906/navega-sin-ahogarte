import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousPostAdmin } from './anonymous-post-admin';

describe('AnonymousPostAdmin', () => {
  let component: AnonymousPostAdmin;
  let fixture: ComponentFixture<AnonymousPostAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnonymousPostAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnonymousPostAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
