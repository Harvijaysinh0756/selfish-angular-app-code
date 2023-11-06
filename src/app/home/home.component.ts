import { Component , ViewChild, ElementRef } from '@angular/core';
import { AlertService, AuthenticationService } from '../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { CommonService } from '../_services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

declare var jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent {
    
    public userData : any = [];
    public AllEvent : any = [];
    public stringifiedData : any = [];
    public isLoggedIn : 0;
    public SITE_CONSTANT = [];
     AllEventData: any = [];
     HotEventData: any = [];
     NewEventData: any = [];
    storedProfileAvatar: any = [];
    deviceInfo:DeviceInfo;
    file: File ; 
    imagepath : String;
    firstBanner : any;
    secondBanner : any;
    profileImg : String;
    bannerItemStr : any;
    pageFeed: any = 0;
    isMoreDataFeed = false;
    isLoadMoreShowHide = 'hide';
    lastestPage : any = 0;
    isMobile : any;
    isTablet : any;
    isDesktopDevice : any;
    constructor(
      public commonService:CommonService,
      public formBuilder: FormBuilder,
      private deviceDetectorService: DeviceDetectorService,
      public toastr : ToastrService,
      public authService:AuthenticationService,
      public router:Router) {

      
      this.userData = localStorage.getItem("currentUser");
      
      // this.bannerItemStr = localStorage.getItem('bannerStorage');
      // const item = JSON.parse(this.bannerItemStr);      
      // if(item != null){
      //   this.firstBanner = environment.apiUrl+'/uploads/images/'+item.value[0].banner_image  ; 
      //   this.secondBanner = environment.apiUrl+'/uploads/images/'+item.value[1].banner_image  ; 
      // }else{
      //   this.firstBanner = 'assets/images-nct/adv-banner-1.jpg';
      //   this.secondBanner = 'assets/images-nct/adv-banner-1.jpg';
      // }

      this.firstBanner = 'assets/images-nct/adv-banner-1.jpg';
      this.secondBanner = 'assets/images-nct/adv-banner-1.jpg';

      if(this.userData){
        this.stringifiedData =  JSON.parse(this.userData);  
        //console.log(this.stringifiedData);
        this.isLoggedIn = this.stringifiedData.data.userId;
          //console.log('==============='+this.isLoggedIn);

          this.commonService.getProfile(this.isLoggedIn)
          .then((data: any) => {
            if(data.result.status == 0){
              this.authService.removeAuth();
              this.toastr.error('Account Deactivated.');
              this.router.navigate(['login']);
            }
          });


      }

      //this.userProfile = this.commonService.getProfile(this.isLoggedIn);
      this.imagepath = environment.apiUrl+'/uploads/event/image';
      
      // this.commonService.getAllEvent(this.isLoggedIn)
      // .then((data: any) => {
      //   console.log(data);
      //   console.log(data.result);
      //   this.AllEvent = data.result;
      // })
      // .catch((error: any) => {
      //   console.log("Promise rejected with " + JSON.stringify(error));
      // });

      

    }
    ngOnInit(): void {

       this.getEventList();

       this.deviceInfo = this.deviceDetectorService.getDeviceInfo();

      this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
      this.isMobile = this.deviceDetectorService.isMobile();
      this.isTablet = this.deviceDetectorService.isTablet();
      this.isDesktopDevice = this.deviceDetectorService.isDesktop();
      // console.log(this.deviceInfo);
      // console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
      // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
      // console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.

       //console.log('Device = '+this.deviceInfo);
       this.getHotandNewEvent();

       this.commonService.setTitle('The Selfwish');

       this.commonService.setMetaTags({
            'description': 'Selfwish, Event',
            'keywords': 'Selfwish, Event'
       });
    }

    joinRequest(eventId:any){

        let body = {
          userId: this.isLoggedIn,
          evenId: eventId
        };      

        let options = this.commonService.generateRequestHeadersAuthorise(false);
          this.commonService.postList('requestToJoinEvent',body,options).subscribe((res: any) => {
          if(res.status == true) {               
              this.toastr.success(res.msg);
              //this.isJoinBtnShow = false;
              //this.getEventList();
              jQuery(".eventbox_joinbtn_"+eventId).removeClass("main-btn");
              jQuery(".eventbox_joinbtn_"+eventId).addClass("orange-btn");
              jQuery(".eventbox_joinbtn_"+eventId).prop( "disabled", true );
              jQuery(".eventbox_joinbtn_"+eventId).text("Awaiting Response");
              return true;
          }else{
            this.toastr.error('Something weng wrong');
            return false;

          }
        });
      
    }

    getSearchResult(speciesName:any) {
      let keyword = speciesName.target.form.keyword.value;
      let location = speciesName.target.form.location.value;

      //this.router.navigate(['activities', {keyword: keyword, location: location }]);
      //this.router.navigate(['activities'], queryParams: { filter: 'new' } );

       this.router.navigate(
        ['/activities'], 
        { queryParams: { keyword: keyword, location:location} }
    ); 

      // this.speciesName = speciesName;
      // this.speciesService.getSearchResult(speciesName).subscribe(result => {
      //   this.speciesList = result.results;
      // }, error => this.toastr.error(error.statusText, '', {
      //   timeOut: 3000
      // }));

    }

    getLoadMore(){
      let pages = this.pageFeed + 1;
      // console.log('this.lastestPage'+this.lastestPage);
      // console.log('pages'+pages); 
      if (pages <= this.lastestPage) {
        //this.getEventList(pages+1);
        this.getEventList(pages);
      }
    }

    postActivityBtn() {

      if(this.isLoggedIn){
        this.router.navigate(['add-activity']);
      }else{
        this.router.navigate(['login']);        
      }

    }
    getEventList(page: number = 1) {
      this.pageFeed = page;
      let body = {
        userid: this.isLoggedIn,
        global_id: 0,
        post_type: 'home',
        comment_like_type: 'feed_com',
        page: this.pageFeed,
        limit: 9
      };

      if (this.pageFeed == 1) {
        this.AllEventData = [];
      }

      

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        //this.commonService.postList(this.SITE_CONSTANT['API_END_POINT']+'getAllAddedEvent',body,options).subscribe((res: any) => {
        this.commonService.postList('getAllAddedEvent',body,options).subscribe((res: any) => {
          // console.log('--------vvvvvvvv');
          // console.log(res);
          // console.log('--------vvvvvvvvv');
          // console.log(res.status);
          //this.isLoadMoreShowHide = res.loadmore;
          this.isLoadMoreShowHide = 'show';
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
            a.shareUrl = environment.siteUrl+'/activity/'+a.event_slug;

            //console.log('----'+a.shareUrl);
            // a.getPostTaggedUsers.forEach((b: any,indexB:any)=>{
            //   if(this.isLoggedIn == b.user_id){
            //     a.isTag = true;
            //   } else {
            //     a.isTag = false;
            //   }
            // });
            this.AllEventData.push(a);
          });
          //console.log(this.AllEventData);
          //console.log(this.lastestPage);
          this.lastestPage = res.lastPage;
          if (this.pageFeed == res.lastPage) {
            this.isMoreDataFeed = false;
          } else {
            this.isMoreDataFeed = true;
          }

        }
      });
    }


    getHotandNewEvent() {

      let body = {
        userid: this.isLoggedIn,
        global_id: 0,
        get_type: 'hotandnew',
        comment_like_type: 'feed_com',
        page: 1,
        limit: 9
      };     

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        this.commonService.postList('getHotNewEvent',body,options).subscribe((res: any) => {
          this.isLoadMoreShowHide = 'show';
          if(res.status == true) {     
            res.result_hot.forEach((a: any)=>{
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

                a.shareUrl = environment.siteUrl+'/activity/'+a.event_slug;
                this.HotEventData.push(a);
            });

            res.result_new.forEach((a: any)=>{
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
                a.shareUrl = environment.siteUrl+'/activity/'+a.event_slug;
                this.NewEventData.push(a);
            });
          }
      });
    }
    
}