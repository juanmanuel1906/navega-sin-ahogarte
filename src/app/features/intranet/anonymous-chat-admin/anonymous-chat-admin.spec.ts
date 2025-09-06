import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousChatAdmin } from './anonymous-chat-admin';

describe('AnonymousChatAdmin', () => {
  let component: AnonymousChatAdmin;
  let fixture: ComponentFixture<AnonymousChatAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnonymousChatAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnonymousChatAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
