import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-footer-mobile',
  templateUrl: './footer-mobile.component.html',
  styleUrls: ['./footer-mobile.component.scss']
})
export class FooterMobileComponent {

    isAcitveHome : String;
    isAcitveCalendar : String;
    isAcitveInbox : String;
    isAcitveMenu : String;
    currentComponent :string;
    constructor(private activatedRoute: ActivatedRoute, private router: Router ) {

        this.activatedRoute.url.subscribe((event:any) => {
          this.currentComponent = event[0];
        });
        //console.log('ssss'+this.currentComponent);
        if(this.currentComponent == 'home' ){
            this.isAcitveHome = 'active'; 
        }else if(this.currentComponent == 'activities' ){
            this.isAcitveHome = ''; 
            this.isAcitveMenu = '';             
        }else if(this.currentComponent == 'my-activities' ){
            this.isAcitveHome = ''; 
            this.isAcitveMenu = '';             
            this.isAcitveCalendar = 'active';             
        }else if(this.currentComponent == 'account-settings' ){
            this.isAcitveHome = ''; 
            this.isAcitveMenu = '';             
        }else if(this.currentComponent == 'list-requests' ){
            this.isAcitveHome = ''; 
            this.isAcitveMenu = '';             
        }else if(this.currentComponent == 'my-inbox' ){
            this.isAcitveInbox = 'active'; 
            this.isAcitveHome = ''; 
            this.isAcitveMenu = '';             
        }else{
            this.isAcitveMenu = 'active';             
        }
    }

}
