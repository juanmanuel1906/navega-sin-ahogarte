import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryResources } from './gallery-resources';

describe('GalleryResources', () => {
  let component: GalleryResources;
  let fixture: ComponentFixture<GalleryResources>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryResources]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryResources);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
