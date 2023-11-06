import { Component , ViewChild, ElementRef  } from '@angular/core';
import { AlertService, AuthenticationService } from '../_services';
import { Router, ActivatedRoute  } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { CommonService } from '../_services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import {MatDatepickerModule} from '@angular/material/datepicker';

declare var jQuery: any;
@Component({
  selector: 'app-my-inbox',
  templateUrl: './my-inbox.component.html',
  styleUrls: ['./my-inbox.component.scss']
})


export class MyInboxComponent {
    notfound = false;
    public userData : any = [];
    public AllEvent : any = [];
    public stringifiedData : any = [];
    public isLoggedIn : 0;
    public SITE_CONSTANT = [];
    InboxData: any = [];
    storedProfileAvatar: any = [];
    deviceInfo:DeviceInfo;
    file: File ; 
    imagepath : String;
    profileImg : String;
    chat_type : String = 'e';
    pageFeed: any = 0;
    isMoreDataFeed = false;
    isLoadMoreShowHide = 'hide';
    lastestPage : any = 0;
    constructor(
      public commonService:CommonService,
      public formBuilder: FormBuilder,
      private deviceDetectorService: DeviceDetectorService,
      public toastr : ToastrService,
      public authService:AuthenticationService,
      public activatedRoute:ActivatedRoute,
      public router:Router) {    
      

      this.userData = localStorage.getItem("currentUser");
      if(this.userData){
        this.stringifiedData =  JSON.parse(this.userData);  
        this.isLoggedIn = this.stringifiedData.data.userId;
      }
      this.imagepath = environment.apiUrl+'/uploads/event/image';

      if(!this.isLoggedIn){
          this.router.navigate(['/signup']);        
      }
      
    }

    /*public loadScript() {

      var script = document.getElementById("testScriptName");
      jQuery( script ).remove();
    }*/
    ngOnInit(): void {

      //this.loadScript();

      this.getInboxList();
      this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
      if( this.deviceInfo.deviceType == 'desktop'){}
      //console.log('Device = '+this.deviceInfo.deviceType);

      
    }
    
    getTabData(selectedTab:any){
        this.chat_type = selectedTab;
        this.getInboxList();       
        
    }
    getLoadMore(){
      let pages = this.pageFeed + 1;
      if (pages <= this.lastestPage) {
        this.getInboxList(pages);
      }
    }



    getInboxList(page: number = 1) {
      this.pageFeed = page;
      let body = {
        userid: this.isLoggedIn,
        chat_type: this.chat_type,
        page: this.pageFeed,
        limit: 8
      };

      if (this.pageFeed == 1) {
        this.InboxData = [];
      }

      

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        this.commonService.postList('getInbox',body,options).subscribe((res: any) => {
          console.log(res);
          console.log(res.status);
          this.isLoadMoreShowHide = res.loadmore;
        if(res.status == true) {     
          res.result.forEach((a: any)=>{
            if(this.chat_type == 'u'){

              if(a.from_user_id == this.isLoggedIn){
                
                if(a.to_profileimage=='' || a.to_profileimage==null){
                  a.profile_img = 'assets/images-nct/no_image.png';
                }else{
                  a.profile_img = environment.apiUrl+'/uploads/profile/'+a.to_profileimage;
                }
                a.user_name = a.to_user;
              }else{

                if(a.from_profileimage=='' || a.from_profileimage==null){
                  a.profile_img = 'assets/images-nct/no_image.png';
                }else{
                  a.profile_img = environment.apiUrl+'/uploads/profile/'+a.from_profileimage;
                }

                a.user_name = a.from_user;

              }

            }
            this.InboxData.push(a);
          });
          this.lastestPage = res.lastPage;
          if (this.pageFeed == res.lastPage) {
            this.isMoreDataFeed = false;
          } else {
            this.isMoreDataFeed = true;
          }
          this.notfound = false;

        }else{
          this.notfound = true;
        }
      });
    }


    
}