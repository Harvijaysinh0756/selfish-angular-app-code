import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AlertService, AuthenticationService } from '../_services';

import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { UrlService } from '../url.service';
import { CommonService } from '../_services/common.service';

declare var jQuery: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  deviceInfo:DeviceInfo;
  rememberMe : any ;
  remember_email : any;
  remember_pass : any;

  public showPassword: boolean = false;
  show = false;
  constructor(
        public commonService:CommonService,
        private deviceDetectorService: DeviceDetectorService,
        private formBuilder: FormBuilder,
        public authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        public toastr : ToastrService,
        private urlService: UrlService
        //public commonService:CommonService
        ) {}

  public loadScript() {

      var script = document.getElementById("testScriptName");
      jQuery( script ).remove();
    }

  ngOnInit() {

      this.loadScript();
      this.rememberMe = localStorage.getItem("rFlag");
      console.log('rrrrrrrrrrrrrrrrrrrrrr = ' + this.rememberMe);
      if(this.rememberMe){
        this.remember_email = localStorage.getItem("rEmail");
        this.remember_pass = localStorage.getItem("rPwd");
      }

      this.urlService.previousUrl$.subscribe((previousUrl: string) => {
        console.log('previous url: ', previousUrl);
      });

      this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
       console.log('Device = '+this.deviceInfo.deviceType);

      this.loginForm = this.formBuilder.group({
          email: [this.remember_email, [Validators.required, Validators.email,this.emailValidator]],
          password: [this.remember_pass, Validators.required],
          remember: [this.rememberMe]
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
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile-menu-mobile';
      }
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.show = !this.show;
  }
  emailValidator(control:any) {
      if (control.value) {
        const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
        return matches ? null : { 'invalidEmail': true };
      } else {
        return null;
      }
    }
    
  get f() { return this.loginForm.controls; }

  // onSubmit() { 
  //   if(this.loginForm.value.email != '' && this.loginForm.value.password != ''){

  //     let remember = this.commonService.checkVar(this.loginForm.value.remember);

  //     let body = {
  //       email:this.loginForm.value.email,
  //       password:this.loginForm.value.password
  //     };
  //     let options = this.commonService.generateRequestHeaders();
  //     this.commonService.SubmiPostFormData('login',body,options)
  //     .then((response) => {          
  //       if(response.status == true){
  //         response.data.auth_token = response.auth_token;
  //         this.toastr.success(this.LANG_CONSTANT['Successfully_login']);
  //         this.authService.grantAuth(response.data.userid,response.data);

  //         if(remember){
  //           localStorage.setItem('rEmail',btoa(this.loginForm.value.email));
  //           localStorage.setItem('rPwd',btoa(this.loginForm.value.password));
  //           localStorage.setItem('rFlag','true');
  //         }else{
  //           localStorage.removeItem('rEmail');
  //           localStorage.removeItem('rPwd');
  //           localStorage.removeItem('rFlag');
  //         }

  //         if (this.authService.authRedirectURL && this.authService.authRedirectURL != '') {
  //           this.router.navigate([this.authService.authRedirectURL]);
  //           this.authService.authRedirectURL = '';
  //           return true;
  //         }else{
  //           //this.router.navigate(['/',this.authService.loggedInUserData.slug]);
  //           this.router.navigate(['/home']);
  //           return true;
  //         }
  //       }else{
  //         if(response.message != ''){
  //           this.toastr.error(response.message);        
  //         }
  //         return false;
  //       }  
  //     }).catch((error) => {
  //       this.toastr.error(this.LANG_CONSTANT['ERROR_MSG']);
  //       return false;
  //     });
  //   }else{
  //       this.toastr.error(this.LANG_CONSTANT['Please_enter_required_field_to_submit']);
  //   }
  // }
  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      let remember = this.commonService.checkVar(this.f.remember.value);
     

      this.loading = true;
      this.authenticationService.login(this.f.email.value, this.f.password.value)
          .pipe(first())
          .subscribe(
              data => {
                  console.log(data);
                  if(data.success){

                    if(remember){
                        localStorage.setItem('rEmail',this.f.email.value);
                        localStorage.setItem('rPwd',this.f.password.value);
                        localStorage.setItem('rFlag','true');
                    }else{
                        localStorage.removeItem('rEmail');
                        localStorage.removeItem('rPwd');
                        localStorage.removeItem('rFlag');
                    }

                    this.toastr.success(data.message);
                    //this.authenticationService.grantAuth(data.data.userid,data.data,data.data.token);
                    this.router.navigate([this.returnUrl]);
                  }else{
                    this.toastr.error(data.message);
                    this.loading = false;
                  }
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
  }

}
