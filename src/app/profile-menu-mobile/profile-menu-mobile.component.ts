import { Component } from '@angular/core';
import { AlertService, AuthenticationService } from '../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { CommonService } from '../_services/common.service';

@Component({
  selector: 'app-profile-menu-mobile',
  templateUrl: './profile-menu-mobile.component.html',
  styleUrls: ['./profile-menu-mobile.component.scss']
})
export class ProfileMenuMobileComponent {

    cmspagesList: any = [];
    public userData : any = [];
    public stringifiedData : any = [];
    public isLoggedIn : 0;
    deviceInfo:DeviceInfo;
    constructor(
      public commonService:CommonService,
      private deviceDetectorService: DeviceDetectorService,
      public toastr : ToastrService,
      public authService:AuthenticationService,
      public router:Router) {

      this.userData = localStorage.getItem("currentUser");
      if(this.userData){
        this.stringifiedData =  JSON.parse(this.userData);  
        this.isLoggedIn = this.stringifiedData.data.userId;
      }

      console.log('Login page '+  localStorage.getItem("auth_token") );
      if( !localStorage.getItem("auth_token") ){
        this.router.navigate(['/login']);
      }


    }
    ngOnInit(): void {
       this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
       console.log('Device = '+this.deviceInfo);

       this.commonService.getCmsPages()
        .then((data: any) => {
            
            this.cmspagesList = data.result;
            //console.log(data.result);
          
        })
        .catch((error: any) => {
          console.log("Promise rejected with " + JSON.stringify(error));
        });

    }
    logoutUser(){

      this.authService.removeAuth();
      this.toastr.success('Logout Successfully.');
      this.router.navigate(['/login']);
    }
}
