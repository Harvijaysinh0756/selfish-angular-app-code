import { Component , ViewChild, ElementRef } from '@angular/core';
import { AlertService, AuthenticationService } from '../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { CommonService } from '../_services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.scss']
})
export class VerifyemailComponent {


    emailverifycode : any;
    iswait : any = 'Wait...';
    constructor(
      public commonService:CommonService,
      public toastr : ToastrService,
      public authService:AuthenticationService,
      public activatedRoute:ActivatedRoute,
      public router:Router) {

    }

    ngOnInit(): void {
       this.emailverifycode = this.activatedRoute.snapshot.params["emailverifycode"] ;
       this.checkVerifyEmail();
    }

    checkVerifyEmail() {
      let body = {
        emailverifycode: this.emailverifycode,
      };

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        this.commonService.postList('verify-email',body,options).subscribe((res: any) => {          
        if(res.status == true) {        
            this.iswait = 'Login';
            this.toastr.success(res.msg);
            this.router.navigate(['login']);
            //this.event_user_id = res.result.user_id;           
        }else{
            this.toastr.error(res.err);
            this.iswait = 'Login';
        }
      });
    }
}
