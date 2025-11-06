import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityPostEntry } from './community-post-entry';

describe('CommunityPostEntry', () => {
  let component: CommunityPostEntry;
  let fixture: ComponentFixture<CommunityPostEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityPostEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityPostEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
