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
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent {
    
    public userProfile : any = [];
    public isLoggedIn : 0;
    deviceInfo:DeviceInfo;
    file: File ; 
    imagepath : String;
    profileImg : String;
    userId = 0;
    isChatIconDisplay = true;
    public userData : any = [];
    public stringifiedData : any = [];
    
    constructor(
      public commonService:CommonService,
      public formBuilder: FormBuilder,
      private deviceDetectorService: DeviceDetectorService,
      public toastr : ToastrService,
      public activatedRoute:ActivatedRoute,
      public router:Router) {

      
      this.userData = localStorage.getItem("currentUser");
      if(this.userData){
        this.stringifiedData =  JSON.parse(this.userData);  
        this.isLoggedIn = this.stringifiedData.data.userId;
      }

      this.userId = this.activatedRoute.snapshot.params["id"] ;
      this.imagepath = environment.apiUrl+'/uploads/profile/';      
      this.commonService.viewProfile(this.userId)
      .then((data: any) => {
        this.userProfile = data.result;
        this.profileImg = this.imagepath+this.userProfile.profile_img;
        
      })
      .catch((error: any) => {
        console.log("Promise rejected with " + JSON.stringify(error));
      });
      if(this.userId == this.isLoggedIn){
          this.isChatIconDisplay = false;
      }


    }
    ngOnInit(): void {
    }


    chatDetail(){

        
        if(!this.isLoggedIn){          
          this.router.navigate(['login']);        
        }

        let body = {
          chat_type: 'u',
          from_user_id: this.isLoggedIn,
          to_user_id: this.userId,
          evenId: this.userId
        };      

        let options = this.commonService.generateRequestHeadersAuthorise(false);
          this.commonService.postList('ConnetChat',body,options).subscribe((res: any) => {
            console.log(res);
          if(res.status == true) {               
              this.router.navigate(['/chat-detail/'+res.result]);
              return true;
          }else{
            this.toastr.error('Something weng wrong');
            return false;

          }
        });

    }


}
