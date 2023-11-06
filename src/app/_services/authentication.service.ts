import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
    public isLoggedIn : boolean = false;
    public loggedInUserId : string = '';    
    public loggedInUserData : any = [];

    async load() : Promise<any> {    
        console.log('this');
        if(localStorage.getItem("auth_token") && localStorage.getItem("auth_token") !== null && localStorage.getItem("auth_token") !== undefined && localStorage.getItem("auth_token") != '' ){
          var auth_token =  localStorage.getItem('auth_token');
          if(auth_token != ''){
            console.log('fff');
          }else{
            console.log('not found');
          }
        }else{
           console.log('storage not found'); 
        }
           console.log('Load auth'); 

    }
    constructor(private http: HttpClient) { }


    login(email: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/api/login`, { email: email, password: password })
            .pipe(map(user => {
                console.log(user);
                // login successful if there's a jwt token in the response
                if (user.data && user.data.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    
                    
                    this.grantAuth(user.data.userId,user.data.userData,user.data.token);

                    //return false;
                    
                    localStorage.setItem('currentUserImage', user.data.profile_img);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    public grantAuth(loggedInUserId : string,loggedInUserData : any,auth_token : any){
        console.log('auth_token'+auth_token);
        this.isLoggedIn = true;
        this.loggedInUserId = loggedInUserId;
        this.loggedInUserData = loggedInUserData;
        localStorage.setItem('auth_token',auth_token);
        localStorage.setItem('user_data',loggedInUserData);
        
    }

    public removeAuth(){

        this.isLoggedIn = false;
        this.loggedInUserId = '';
        this.loggedInUserData = [];
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('currentUser');

    }
}