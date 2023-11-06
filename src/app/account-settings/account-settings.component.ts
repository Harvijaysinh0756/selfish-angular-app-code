import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AlertService, AuthenticationService } from '../_services';
import { CommonService } from '../_services/common.service';
//import { customValidations } from '../validators/custom-validator';
import { Location } from '@angular/common';
import { ConfirmedValidator } from './match-password.validator';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import Swal from 'sweetalert2';

declare var jQuery: any;
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})

export class AccountSettingsComponent {

    public frmChangePass: FormGroup;
    loading = false;
    submitted = false;
    deviceInfo:DeviceInfo;
    public userData : any = [];
    public stringifiedData : any = [];
    public isLoggedIn : 0;
    public showPassword: boolean = false;
    public showPasswordc: boolean = false;
    public showPassworda: boolean = false;
    show = false;
    showc = false;
    showa = false;
    constructor(
      private location: Location,
      public authService:AuthenticationService,
      private deviceDetectorService: DeviceDetectorService,
      public commonService:CommonService,
      public formBuilder: FormBuilder,
      public toastr : ToastrService,
      public authenticationService: AuthenticationService,
      private activatedRoute: ActivatedRoute,
      private router: Router) 
    { 


      this.userData = localStorage.getItem("currentUser");
      if(this.userData){
        this.stringifiedData =  JSON.parse(this.userData);  
        //console.log(this.stringifiedData);
        this.isLoggedIn = this.stringifiedData.data.userId;
      }

      if(!this.isLoggedIn){
          this.router.navigate(['/signup']);        
      }

      this.frmChangePass = formBuilder.group({
          'current_password' : ['', [Validators.required,Validators.minLength(6)]],
          'new_password' : ['', [Validators.required,Validators.minLength(6)]],
          'password_confirmation' : ['', [Validators.required]],          
        }, 
        { 
            validator: ConfirmedValidator('new_password', 'password_confirmation')
        }
        );
      
    }


    public loadScript() {

      var script = document.getElementById("testScriptName");
      jQuery( script ).remove();
    }

    ngOnInit() {
       this.loadScript();            
       this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
       console.log('Device = 123 '+this.deviceInfo.deviceType);
    }  
    public togglePasswordVisibility(): void {
      this.showPassword = !this.showPassword;
      this.show = !this.show;
    }
    public togglePasswordVisibilityConfirm(): void {
      this.showPasswordc = !this.showPasswordc;
      this.showc = !this.showc;
    }
    public togglePasswordVisibilityConfirmnew(): void {
      this.showPassworda = !this.showPassworda;
      this.showa = !this.showa;
    }
    get f() { return this.frmChangePass.controls; }
    public submitChangePass(){

        this.submitted = true;

        // stop here if form is invalid
        if (this.frmChangePass.invalid) {
            return;
        }
        this.loading = true;
        let body = new FormData();
        body.append('current_password', this.frmChangePass.value.current_password);
        body.append('new_password', this.frmChangePass.value.new_password);
        body.append('password_confirmation', this.frmChangePass.value.password_confirmation);
        let options = this.commonService.generateRequestHeadersAuthorise(false);
        this.commonService.SubmiPostFormData('change-password',body,options)
        .then((response) => {          
            console.log('Resapose == '+response);
            if(response.success == true){

            this.toastr.success(response.message);
            if(this.deviceInfo.deviceType == 'mobile'){
                this.router.navigate(['/profile-menu-mobile']);
            }else{
                this.router.navigate(['/myprofile']);                
            }
            this.loading = false;
            return true;

            }else{

               if( response.isInvalid ){
                  
                  this.toastr.error(response.message);

               }else if(response.message != ''){
                 
                 const res = JSON.parse(response.message);
                 for(var key in res) {
                    for (var key1 in res[key]) {
                        console.log(res[key][key1])
                        this.toastr.error(res[key][key1]);
                    }
                 }

               }
               this.loading = false;
               return false;
            } 

        }).catch((error) => {

            this.toastr.error('Something weng wrong');
            this.loading = false;
            return false;

        });

    }

    deleteAccount(){

       Swal.fire({
          title: 'Are you sure you would like to delete your account?',
          // text: 'You will not be able to recover this file!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result:any) => {
          
          if (result.value) {
            this.deleteAccountAction();
          }

        })

    }

    deleteAccountAction(){
      
      let body = {
        userId: this.isLoggedIn
      };      

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        
        this.commonService.postList('deleteAccount',body,options).subscribe((res: any) => {
        if(res.success == true) {               
            this.toastr.success(res.message);
            this.authService.removeAuth();
            this.router.navigate(['/home']); 
            return true;
        }else{
          this.toastr.error('Something weng wrong');
          return false;
        }

      });
      
    }

    goBack(): void {
      this.location.back(); 
    }

}