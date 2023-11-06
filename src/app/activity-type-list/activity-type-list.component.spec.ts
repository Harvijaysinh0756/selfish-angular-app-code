import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTypeListComponent } from './activity-type-list.component';

describe('ActivityTypeListComponent', () => {
  let component: ActivityTypeListComponent;
  let fixture: ComponentFixture<ActivityTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityTypeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
