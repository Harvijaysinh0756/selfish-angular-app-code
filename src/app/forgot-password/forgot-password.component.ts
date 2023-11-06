import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../_services/common.service';
import { AlertService, AuthenticationService } from '../_services';

import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  deviceInfo:DeviceInfo;
  constructor(
        public commonService:CommonService,
        private deviceDetectorService: DeviceDetectorService,
        private formBuilder: FormBuilder,
        public authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        public toastr : ToastrService,
        //public commonService:CommonService
        ) {}

  ngOnInit() {

      this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
       console.log('Device = '+this.deviceInfo.deviceType);

      this.loginForm = this.formBuilder.group({
          email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
      });
      console.log('Login page '+  localStorage.getItem("auth_token") );
      if( localStorage.getItem("auth_token") ){

        if(this.deviceInfo.deviceType == 'desktop'){
          this.router.navigate(['/']);
        }else{
          this.router.navigate(['/profile-menu-mobile']);
        }

      }


      // reset login status
      //this.authenticationService.logout();

      // get return url from route parameters or default to '/'
      if(this.deviceInfo.deviceType == 'desktop'){
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      }else{
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile-menu-mobile';
      }
  }

  get f() { return this.loginForm.controls; }

  
  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      let body = {
        email: this.f.email.value
      };      

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        this.commonService.postList('forgot-login',body,options).subscribe((res: any) => {
        if(res.status == true) {               
            this.toastr.success(res.msg);
            this.router.navigate(['/login']);
            return true;
        }else{
          this.toastr.error(res.err);
          return false;

        }
      });


      
  }

}
