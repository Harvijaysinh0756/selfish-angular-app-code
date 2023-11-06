import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListParticipatedComponent } from './list-participated.component';

describe('ListParticipatedComponent', () => {
  let component: ListParticipatedComponent;
  let fixture: ComponentFixture<ListParticipatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListParticipatedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListParticipatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
