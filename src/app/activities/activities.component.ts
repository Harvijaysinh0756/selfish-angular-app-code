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
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})


export class ActivitiesComponent {
    public frmSearchFilter: FormGroup;
    submitted = false;
    notfound = false;
    public userData : any = [];
    public AllEvent : any = [];
    public stringifiedData : any = [];
    public isLoggedIn : 0;
    public SITE_CONSTANT = [];
    AllEventData: any = [];
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
    categoryList: any = [];
    selectedActivityType: any = [];

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
        'category_id' : ['', [Validators.required]],
        'typeofactivity' : ['', [Validators.required]],
        'keyword' : [this.keyword, [Validators.required]],
        'location' : [this.location, [Validators.required]],
        'eventDt' : [this.location, [Validators.required]]
      });

      this.getEventList();
      this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
      //console.log('Device = '+this.deviceInfo);
      this.getCategory();   
      
    }
    changeevent(){
      this.getEventList();
    }
    getCategory(page: number = 1) {
      let body = {
        userid: 0
      };
      this.categoryList = [];
      let options = this.commonService.generateRequestHeadersAuthorise(true,false);
        this.commonService.getList('getCategories',options).subscribe((res: any) => {
          res.data.forEach((a: any)=>{

          });          
          this.categoryList = res.data;
          // let cate_comma = this.EventDetail.categories;
          // this.selectedActivityType = cate_comma.split(",",);          
      });
    }

    joinRequest(eventId:any){

        if(this.isLoggedIn > 0){
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
        }else{

          this.router.navigate(['/signup']);
        }
      
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
      jQuery(".addafterthis").append('<div class="advertise-banner-sec"><div class="container"><figure><img src="assets/images-nct/adv-banner-2.jpg"></figure></div></div>');
      if (pages <= this.lastestPage) {
        //this.getEventList(pages+1);
        this.getEventList(pages);
      }
    }

    getEventList(page: number = 1) {
      this.pageFeed = page;
      let body = {
        userid: this.isLoggedIn,
        global_id: 0,
        category_id: this.frmSearchFilter.value.category_id,
        typeofactivity: this.frmSearchFilter.value.typeofactivity,
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
        this.commonService.postList('getAllAddedEvent',body,options).subscribe((res: any) => {
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
            a.shareUrl = environment.siteUrl+'/activity/'+a.event_slug;
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


    public submitSearchFilter(){
        this.submitted = true;
        let body = new FormData();
        this.eventDt = this.frmSearchFilter.value.eventDt;
        console.log(this.eventDt);
        this.keyword = this.frmSearchFilter.value.keyword;
        this.location = this.frmSearchFilter.value.location;
        this.getEventList();
    }
    
}