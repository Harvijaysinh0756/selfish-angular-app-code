import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable()
export class UrlService {
  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<string>('null');
  public previousUrl$: Observable<string> = this.previousUrl.asObservable();
  public subject = new BehaviorSubject<any>({});

  constructor() { }


  setPreviousUrl(previousUrl: string) {
    this.previousUrl.next(previousUrl);
  }


  // setSubject(value:any) {
  //   this.subject.next(value);
  // }

  // getSubject() {
  //   return this.subject.asObservable().pipe(share());
  // }

}