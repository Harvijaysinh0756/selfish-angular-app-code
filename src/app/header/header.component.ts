import { Component } from '@angular/core';
import { AlertService, AuthenticationService } from '../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    public userData : any = [];
    public stringifiedData : any = [];
    public isLoggedIn : 0;
    public userProfileimg : any;
    deviceInfo:DeviceInfo;
    constructor(
      // public commonService:CommonService,
      private deviceDetectorService: DeviceDetectorService,
      public toastr : ToastrService,
      public authService:AuthenticationService,
      public router:Router) {

      this.userData = localStorage.getItem("currentUser");
      this.userProfileimg = localStorage.getItem("currentUserImage");
      if(this.userData){
        this.stringifiedData =  JSON.parse(this.userData);  
        this.isLoggedIn = this.stringifiedData.data.userId;
      }
      //console.log(this.stringifiedData);

      //console.log(this.userData->userId);
      // console.log('===='+localStorage.getItem("currentUser").user_name);
      // console.log(this.authService.loggedInUserData.user_name);
    }
    ngOnInit(): void {
       this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
       console.log('Device = '+this.deviceInfo);
    }
    logoutUser(){

      this.authService.removeAuth();
      this.toastr.success('Logout Successfully.');
      this.router.navigate(['login']);
      
      // if(this.authService.loggedInUserId != ''){
      //   let userid = this.authService.loggedInUserId;
      //   let auth_token = this.authService.loggedInUserData.auth_token;

      //   let body = {'userid':userid,'auth_token':auth_token};
      //   let options = this.commonService.generateRequestHeaders();
      //   this.commonService.SubmiPostFormData('logout-user-from-site',body,options)
      //   .then((response) => {          
      //     if(response.status == true){
      //       this.toastr.success(this.LANG_CONSTANT['Successfully_logout']);
      //       this.authService.removeAuth();
      //       this.router.navigate(['/signin']);
      //       return true;
      //     }else{
      //       if(response.message != ''){
      //         this.toastr.error(response.message);        
      //       }
      //       return false;
      //     }  
      //   }).catch((error) => {
      //     this.toastr.error(this.LANG_CONSTANT['ERROR_MSG']);
      //     return false;
      //   });
      // }
    }
}
