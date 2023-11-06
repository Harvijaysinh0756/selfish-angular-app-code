import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HeaderService {
  public title = new BehaviorSubject('Title');
  public profileimg = new BehaviorSubject('');
  
  constructor() { }

  setTitle(title:any,profileimg:any='') {
    this.title.next(title);
    this.profileimg.next(profileimg);
  }
}