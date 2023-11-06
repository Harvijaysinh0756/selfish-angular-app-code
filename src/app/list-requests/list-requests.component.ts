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
  selector: 'app-list-requests',
  templateUrl: './list-requests.component.html',
  styleUrls: ['./list-requests.component.scss']
})

export class ListRequestsComponent {
    
    submitted = false;
    notfound = false;
    notMyjoiningfound = false;
    //isAddActivityBtn = false;
    public userData : any = [];
    public AllEvent : any = [];
    public stringifiedData : any = [];
    public isLoggedIn : 0;
    public SITE_CONSTANT = [];
    aceeptRejectAction = false;
    notfoundListofRequest = false;
    AlllistOfRequest: any = [];
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
        reuest_status: actiontype,
        userid: this.isLoggedIn
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
      
      
      let body = {
        userid: this.isLoggedIn,
        evenId: this.evenId,
        post_type: 'feed',
        comment_like_type: 'feed_com',
        page: 1,
        limit: 4
      };


      this.AlllistOfRequest = [];

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        this.commonService.postList('listOfRequest',body,options).subscribe((res: any) => {
          //console.log(res);
          //console.log(res.status);
          this.isLoadMoreShowHide = res.loadmore;
        if(res.status == true) {     
          res.result.forEach((a: any)=>{

            if(a.image=='' || a.image==null){
              a.image = 'assets/images-nct/no_image.png';
            }else{
              a.image = this.imagepath+'/'+a.image;
            }

            if(a.profile_img=='' || a.profile_img==null){
              a.profile_img = 'assets/images-nct/no_image.png';
            }else{
              a.profile_img = environment.apiUrl+'/uploads/profile/'+a.profile_img;
            }
            if( a.event_userId == this.isLoggedIn ){
              this.aceeptRejectAction = true;
            }

            this.AlllistOfRequest.push(a);
          });
          
          this.notfoundListofRequest = false;

        }else{
          this.notfoundListofRequest = true;
        }
      });
    }



    
}