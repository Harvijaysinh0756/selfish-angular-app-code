import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileAppComponent } from './edit-profile-app.component';

describe('EditProfileAppComponent', () => {
  let component: EditProfileAppComponent;
  let fixture: ComponentFixture<EditProfileAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProfileAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProfileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
