import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousChat } from './anonymous-chat';

describe('AnonymousChat', () => {
  let component: AnonymousChat;
  let fixture: ComponentFixture<AnonymousChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnonymousChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnonymousChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
