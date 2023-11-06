import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmspagesComponent } from './cmspages.component';

describe('CmspagesComponent', () => {
  let component: CmspagesComponent;
  let fixture: ComponentFixture<CmspagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmspagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmspagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
