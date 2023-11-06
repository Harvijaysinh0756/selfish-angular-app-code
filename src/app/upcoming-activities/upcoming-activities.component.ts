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

@Component({
  selector: 'app-upcoming-activities',
  templateUrl: './upcoming-activities.component.html',
  styleUrls: ['./upcoming-activities.component.scss']
})


export class UpcomingActivitiesComponent {
    public frmSearchFilter: FormGroup;
    submitted = false;
    notfound = false;
    notMyjoiningfound = false;
    isAddActivityBtn = false;
    public userData : any = [];
    public AllEvent : any = [];
    public stringifiedData : any = [];
    public isLoggedIn : 0;
    public SITE_CONSTANT = [];
    AllEventData: any = [];
    MyjoiningEvent: any = [];
    storedProfileAvatar: any = [];
    deviceInfo:DeviceInfo;
    file: File ; 
    imagepath : String;
    profileImg : String;
    pageFeed: any = 0;
    isMoreDataFeed = false;
    isLoadMoreShowHide = 'hide';
    lastestPage : any = 0;
    keyword : any;
    location : any;
    eventDt : any;
    sub : any;
    isMenuOpened: String ;
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
        //console.log(this.stringifiedData);
        this.isLoggedIn = this.stringifiedData.data.userId;
      }

      //this.userProfile = this.commonService.getProfile(this.isLoggedIn);
      this.imagepath = environment.apiUrl+'/uploads/event/image';

    }
    ngOnInit(): void {

      this.sub = this.activatedRoute.queryParams
       .subscribe(params => {
                   this.keyword = params['keyword'];     
                   this.location = params['location'];     
      });
      
      this.frmSearchFilter = this.formBuilder.group({
        'keyword' : [this.keyword, [Validators.required]],
        'location' : [this.location, [Validators.required]],
        'eventDt' : [this.location, [Validators.required]]
      });

      this.getUpcomingEventList();
      this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
      if( this.deviceInfo.deviceType == 'desktop'){
        this.isAddActivityBtn = true;
      }
      console.log('Device = '+this.deviceInfo.deviceType);

      
    }

    toggleMenu(): void {
      //this.isMenuOpened = 'show';
      // console.log('open');
      // console.log(this.isMenuOpened);
      this.isMenuOpened = this.isMenuOpened == 'show' ? '' : 'show';
    }

    clickedOutside(): void {
      this.isMenuOpened = 'show';
      // console.log('ddd');
      // this.isMenuOpened = true;
    }

    handleDOBChange(event:any) {
      this.isMenuOpened = 'show';
      const m = event.value;
      if(m){
        //console.log("Date of Birth: " + m.toDate());
      }
    }
    
    getLoadMore(){
      let pages = this.pageFeed + 1;
      // console.log('this.lastestPage'+this.lastestPage);
      // console.log('pages'+pages); 
      if (pages <= this.lastestPage) {
        //this.getUpcomingEventList(pages+1);
        this.getUpcomingEventList(pages);
      }
    }

    

    getUpcomingEventList(page: number = 1) {
      this.pageFeed = page;
      let body = {
        userid: this.isLoggedIn,
        global_id: 0,
        post_type: 'feed',
        comment_like_type: 'feed_com',
        page: this.pageFeed,
        keyword: this.keyword,
        location: this.location,
        eventDt: this.eventDt,
        limit: 6
      };

      if (this.pageFeed == 1) {
        this.AllEventData = [];
      }

      

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        //this.commonService.postList(this.SITE_CONSTANT['API_END_POINT']+'getAllAddedEvent',body,options).subscribe((res: any) => {
        this.commonService.postList('getMyUpcomingEvent',body,options).subscribe((res: any) => {
          console.log(res);
          console.log(res.status);
          this.isLoadMoreShowHide = res.loadmore;
        if(res.status == true) {     
          res.result.forEach((a: any)=>{

            if(a.image=='' || a.image==null){
              
              if(a.video=='' || a.video==null){
                a.image = 'assets/images-nct/no_image.png';
              }else{
                a.image = 'assets/images-nct/video-img.jpg';
              }
            }else{
              a.image = this.imagepath+'/'+a.image;
            }

            if(a.profile_img=='' || a.profile_img==null){
              a.profile_img = 'assets/images-nct/no_image.png';
            }else{
              a.profile_img = environment.apiUrl+'/uploads/profile/'+a.profile_img;
            }
            // a.getPostTaggedUsers.forEach((b: any,indexB:any)=>{
            //   if(this.isLoggedIn == b.user_id){
            //     a.isTag = true;
            //   } else {
            //     a.isTag = false;
            //   }
            // });
            this.AllEventData.push(a);
          });
          console.log(this.AllEventData);
          console.log(this.lastestPage);
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