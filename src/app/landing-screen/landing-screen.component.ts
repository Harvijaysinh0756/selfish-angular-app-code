import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-landing-screen',
  templateUrl: './landing-screen.component.html',
  styleUrls: ['./landing-screen.component.scss']
})
export class LandingScreenComponent {

      loading = false;
      returnUrl: string;
      constructor(
            private route: ActivatedRoute,
            private router: Router,
            //public commonService:CommonService
            ) {}

      ngOnInit() {

          if( localStorage.getItem("auth_token") ){

            
              //this.router.navigate(['/profile-menu-mobile']);
              this.router.navigate(['/home']);
            

          }

      }
}
