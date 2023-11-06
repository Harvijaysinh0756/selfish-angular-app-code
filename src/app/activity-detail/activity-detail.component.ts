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
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.scss']
})
export class ActivityDetailComponent {

    AllListParticipate: any = [];
    AlllistOfRequest: any = [];
    EventDetail: any = [];
    imagepath : String;
    evenId : 0;
    event_user_id : 0;
    evenSlug : any;
    public isLoggedIn : 0;
    public userData : any = [];
    public stringifiedData : any = [];
    notfound = false;
    notfoundListofRequest = false;
    isMoreDataFeed = false;
    aceeptRejectAction = false;
    isJoinBtnShow = true;
    isLoadMoreShowHide = 'hide';
    //iseligibleChat = false;
    displaychatOption = true;

    @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
    isPlay: boolean = true;
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

    }

    ngOnInit(): void {
       this.evenSlug = this.activatedRoute.snapshot.params["slug"] ;
       this.getEventDetail();
    }


    toggleVideo(event:any) {
      this.videoplayer.nativeElement.play();
    }
    video() {
      console.log('im Play!');
      this.videoplayer?.nativeElement.play();
    }

    chatDetail(){

        //this.router.navigate(['/my-inbox']);

        if(!this.isLoggedIn){  

          this.router.navigate(['login']);        

        }else{

           this.commonService.CheckIsEligibleForChat(this.isLoggedIn,this.evenId)
           .then((data: any) => {
                if(!data.status){
                    this.toastr.error(data.err);
                }else{
                  this.conntectChat();
                }           
           });


        }

    }

    conntectChat(){

        let body = {
          chat_type: 'e',
          from_user_id: this.isLoggedIn,
          to_user_id: this.event_user_id,
          evenId: this.evenId
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
    joinRequest(){

      if(this.isLoggedIn > 0){
        let body = {
          userId: this.isLoggedIn,
          evenId: this.evenId
        };      

        let options = this.commonService.generateRequestHeadersAuthorise(false);
          this.commonService.postList('requestToJoinEvent',body,options).subscribe((res: any) => {
          if(res.status == true) {               
              this.toastr.success(res.msg);
              this.isJoinBtnShow = false;
              this.listOfRequest(this.evenId);
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

    getEventDetail() {
      let body = {
        userid: this.isLoggedIn,
        evenId: 0,
        evenSlug: this.evenSlug,
      };

      let options = this.commonService.generateRequestHeaders(false);
        this.commonService.postList('getSingleEventDetail',body,options).subscribe((res: any) => {          
        if(res.status == true) {
          
            this.event_user_id = res.result.user_id;
            if(this.isLoggedIn == this.event_user_id){
                this.displaychatOption = false;
            }
            if(res.result.image=='' || res.result.image==null){
              res.result.image = 'assets/images-nct/no_image.png';
            }else{
              res.result.image = environment.apiUrl+'/uploads/event/image/'+res.result.image;
            }
            if(res.result.video=='' || res.result.video==null){
              res.result.video = null;
            }else{
              res.result.video = environment.apiUrl+'/uploads/event/image/'+res.result.video;
            }
            if(res.result.profile_img=='' || res.result.profile_img==null){
              res.result.profile_img = 'assets/images-nct/no_image.png';
            }else{
              res.result.profile_img = environment.apiUrl+'/uploads/profile/'+res.result.profile_img;
            }      

            res.result.shareUrl =  environment.siteUrl+'/activity/'+res.result.event_slug+'/';

            this.commonService.setTitle(res.result.title);

            this.commonService.setMetaTags({
                'description': res.result.description,
                'keywords': res.result.title,

                'ogtype': '',
                'ogtitle': res.result.title,
                'ogdesc': res.result.description,
                'ogimgwidth': '',
                'ogimgheight': '',
                'ogimage': res.result.image,
                'ogurl': res.result.shareUrl,
                'ogsecure_url': res.result.image,

                'twitter_card': res.result.title,
                'twitter_title': res.result.title,
                'twitter_img': res.result.image,
                'twitter_desc': res.result.description,

            });

            //this.EventDetail.push(a);
            this.evenId = res.result.id;
            if(this.isLoggedIn > 0){
              this.getListParticipate(res.result.id);
              this.listOfRequest(res.result.id);
            }
            this.EventDetail = res.result;
            //console.log(res.result.id);

        }
      });
    }

    getListParticipate(evenId:any) {
      
      let body = {
        userid: this.isLoggedIn,
        evenId: evenId,
        post_type: 'feed',
        comment_like_type: 'feed_com',
        page: 1,
        limit: 4
      };


      this.AllListParticipate = [];

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        this.commonService.postList('listOfParticipates',body,options).subscribe((res: any) => {
          //console.log(res);
          //console.log(res.status);
          this.isLoadMoreShowHide = res.loadmore;
          this.isJoinBtnShow = true;

        if(res.status == true) {     
          res.result.data.forEach((a: any)=>{

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
            this.AllListParticipate.push(a);
          });
          
          this.notfound = false;

        }else{
          this.notfound = true;
        }
      });
    }

    listOfRequest(evenId:any) {
      
      let body = {
        userid: this.isLoggedIn,
        evenId: evenId,
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

    actionRequest(actiontype:any,reqId:any){
        //console.log(actiontype);
        //console.log(reqId);
        this.postRequestAcceptReject(actiontype,reqId);

    }

    postRequestAcceptReject(actiontype: any, reqId: any) {
      let body = {
        userid: this.isLoggedIn,
        event_req_id: reqId,
        reuest_status: actiontype
      };      

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        this.commonService.postList('requestAcceptReject',body,options).subscribe((res: any) => {
        if(res.status == true) {               
            this.toastr.success(res.result);
            this.listOfRequest(this.evenId);
            this.getListParticipate(this.evenId);
            return true;
        }else{
          this.toastr.error('Something weng wrong');
          return false;

        }
      });
    }
}
