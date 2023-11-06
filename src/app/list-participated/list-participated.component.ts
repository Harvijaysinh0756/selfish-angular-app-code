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
  selector: 'app-list-participated',
  templateUrl: './list-participated.component.html',
  styleUrls: ['./list-participated.component.scss']
})

export class ListParticipatedComponent {
    
    submitted = false;
    notfound = false;
    notMyjoiningfound = false;
    //isAddActivityBtn = false;
    public userData : any = [];
    public AllEvent : any = [];
    public stringifiedData : any = [];
    public isLoggedIn : 0;
    public SITE_CONSTANT = [];
    AllListParticipate: any = [];
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
    
    evenId : any;
    sub : any;
    //isMenuOpened: String ;
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

      this.evenId = this.activatedRoute.snapshot.params["id"] ;      
      this.getListRequest();

      
    }

    getLoadMore(){
      let pages = this.pageFeed + 1;
      if (pages <= this.lastestPage) {
        this.getListRequest(pages);
      }
    }

    actionRequest(actiontype:any,reqId:any){
        console.log(actiontype);
        console.log(reqId);
        this.postRequestAcceptReject(actiontype,reqId);

    }

    postRequestAcceptReject(actiontype: any, reqId: any) {
      let body = {
        event_req_id: reqId,
        reuest_status: actiontype
      };      

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        this.commonService.postList('requestAcceptReject',body,options).subscribe((res: any) => {
        if(res.status == true) {               
            this.toastr.success(res.result);
            //this.loading = false;
            this.getListRequest();
            return true;
        }else{

          this.toastr.error('Something weng wrong');
          //this.loading = false;
          return false;

        }
      });
    }

    getListRequest(page: number = 1) {
      this.pageFeed = page;
      let body = {
        userid: this.isLoggedIn,
        evenId: this.evenId,
        post_type: 'feed',
        comment_like_type: 'feed_com',
        page: this.pageFeed,
        limit: 8
      };

      if (this.pageFeed == 1) {
        this.AllListParticipate = [];
      }

      

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        this.commonService.postList('listOfParticipates',body,options).subscribe((res: any) => {
          console.log(res);
          console.log(res.status);
          this.isLoadMoreShowHide = res.loadmore;
        if(res.status == true) {     
          res.result.data.forEach((a: any)=>{

            if(a.image=='' || a.image==null){
              a.image = 'assets/images-nct/no_image.png';
              a.profile_img = 'assets/images-nct/no_image.png';
            }else{
              a.image = this.imagepath+'/'+a.image;
              a.profile_img = environment.apiUrl+'/uploads/profile/'+a.profile_img;
            }
            this.AllListParticipate.push(a);
          });
          console.log(this.AllListParticipate);
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