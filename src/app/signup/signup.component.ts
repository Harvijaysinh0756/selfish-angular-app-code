import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AlertService, AuthenticationService } from '../_services';
import { CommonService } from '../_services/common.service';
//import { customValidations } from '../validators/custom-validator';

import { ConfirmedValidator } from './match-password.validator';

declare var jQuery: any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  // moduleId : 'signup'
})

export class SignupComponent {

    public frmRegistration: FormGroup;
    public isCaptchaResolved = false;
    loading = false;
    submitted = false;
    isDisableBtn = false;
    public showPassword: boolean = false;
    public showPasswordc: boolean = false;
    show = false;
    showc = false;
    //public csValid = new customValidations();
    constructor(
      public commonService:CommonService,
      public formBuilder: FormBuilder,
      public toastr : ToastrService,
      private alertService: AlertService,
      public authenticationService: AuthenticationService,
      private activatedRoute: ActivatedRoute,
      private router: Router) 
    { 
      this.frmRegistration = formBuilder.group({
          'acceptTerms': [false, Validators.requiredTrue],
          'first_name' : ['', [Validators.required]],
          'last_name' : ['', [Validators.required]],
          'email': ['', [Validators.required,Validators.email,this.emailValidator]],
          'password' : ['', [Validators.required,Validators.minLength(6)]],
          'c_password' : ['', [Validators.required]],
          //'mobile' : ['', [Validators.required,Validators.minLength(10),Validators.maxLength(15)]],
        }, 
        { 
            validator: ConfirmedValidator('password', 'c_password')
        }
        );
      //this.frmRegistration.setValidators(this.csValid.comparisonValidator(this.frmRegistration,'password','confirm_password'));
      
    }

    public loadScript() {

      var script = document.getElementById("testScriptName");
      jQuery( script ).remove();
    }

    ngOnInit() {
      this.loadScript();
    }  
    
    public togglePasswordVisibility(): void {
      this.showPassword = !this.showPassword;
      this.show = !this.show;
    }
    public togglePasswordVisibilityConfirm(): void {
      this.showPasswordc = !this.showPasswordc;
      this.showc = !this.showc;
    }
    emailValidator(control:any) {
      if (control.value) {
        const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
        return matches ? null : { 'invalidEmail': true };
      } else {
        return null;
      }
    }

    get f() { return this.frmRegistration.controls; }
    public submitRegistration(){

        this.submitted = true;

        // stop here if form is invalid
        if (this.frmRegistration.invalid) {
            return;
        }
        this.isDisableBtn = true;
        this.loading = true;
        let body = new FormData();
        body.append('first_name', this.frmRegistration.value.first_name);
        body.append('last_name', this.frmRegistration.value.last_name);
        body.append('email', this.frmRegistration.value.email);
        body.append('password', this.frmRegistration.value.password);
        body.append('c_password', this.frmRegistration.value.c_password);
        body.append('mobile', '');
        let options = this.commonService.generateRequestHeaders(false);

        //let options = this.commonService.generateRequestHeaders(false);
        this.commonService.SubmiPostFormData('register',body,options)
        .then((response) => {          
          if(response.success == true){
            this.doLogin(response.email,response.password,response.name);
            // this.toastr.success(response.message);
            // this.router.navigate(['/home']);
            // this.loading = false;
            return true;
          }else{
            if(response.message != ''){
              //this.toastr.error(response.message);   
              const res = JSON.parse(response.message);
              for(var key in res) {
                 for (var key1 in res[key]) {
                     console.log(res[key][key1])
                     this.toastr.error(res[key][key1]);
                 }
              }

            }
            this.loading = false;
            this.isDisableBtn = false;
            return false;
          }  
        }).catch((error) => {
          this.toastr.error('Something weng wrong');
          this.loading = false;
          this.isDisableBtn = false;
          return false;
        });

    }

    resolved(captchaResponse: string) {
      if(captchaResponse != ''){
        this.isCaptchaResolved = true;
      }
    }


    doLogin(email:any,password:any,name:any) {
        
        this.submitted = true;
        this.loading = true;
        this.authenticationService.login(email, password)
            .pipe(first())
            .subscribe(
                data => {
                    console.log(data);
                    if(data.success){

                      this.toastr.success(''+name+' registered successfully.');
                      this.router.navigate(['/myprofile']);
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
