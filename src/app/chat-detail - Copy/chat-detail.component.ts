import { Component , ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AlertService, AuthenticationService } from '../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { CommonService } from '../_services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HeaderService } from '../header.service';
import { LoaderService } from '../loader.service';

declare var jQuery: any;

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss']
})
export class ChatDetailComponent {

    public frmSend: FormGroup;
    submitted = false;
    firstTime = true;
    imagepath : String;
    evenId : 0;
    tot_ele : 0;
    title : any;
    chatDetail : any;
    ChatId : any;
    event_user_id : any;
    ChatType : any;
    to_userId : any;
    profileimg : any;
    file: File ;
    public isLoggedIn : any;
    public userData : any = [];
    public stringifiedData : any = [];
    public stringifiedChatData : any = [];
    notfound = false;
    @ViewChild('chatbox') div: ElementRef;
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    constructor(
      public loaderService: LoaderService,
      public commonService:CommonService,
      public formBuilder: FormBuilder,
      private deviceDetectorService: DeviceDetectorService,
      public toastr : ToastrService,
      public authService:AuthenticationService,
      public activatedRoute:ActivatedRoute,
      public router:Router,
      private headerService: HeaderService,
      private renderer: Renderer2) {

      

      //this.commonService.setTitle('chat detail page');
        this.tot_ele = 0;
        this.userData = localStorage.getItem("currentUser");
        if(this.userData){
          this.stringifiedData =  JSON.parse(this.userData);  
          this.isLoggedIn = this.stringifiedData.data.userId;
        }


        this.frmSend = formBuilder.group(
                {
                  'message' : ['', []],
                  'attached' : ['', []]
                }
            );

      }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }

    addElement() {


          var chatdata = '';          
          let oldTotData = this.stringifiedChatData.length;    
          //console.log(oldTotData +'-'+ this.tot_ele);
          let finaltotal = 0;
          finaltotal = oldTotData - this.tot_ele;
          //console.log(finaltotal);
          if(!this.firstTime){
            this.stringifiedChatData = this.stringifiedChatData.reverse();
          }
          for (let i = 0; i < finaltotal; i++) {      
            chatdata = '';
            //console.log(this.stringifiedChatData[i].image);
            
            if(this.stringifiedChatData[i].from_user_id == this.isLoggedIn){
                if(this.stringifiedChatData[i].image){
                  chatdata = '<figure><img src="'+this.stringifiedChatData[i].image+'" style="width:100px;"></figure>'
                }
                if(this.stringifiedChatData[i].message){
                chatdata += '<div class="mail-users left-side">\
                                  <div class="rgt-user-chat">\
                                      <p>'+this.stringifiedChatData[i].message+'</p>\
                                  </div>\
                              </div>';
                }
            }else{
                if(this.stringifiedChatData[i].image){
                  chatdata = '<figure><img src="'+this.stringifiedChatData[i].image+'" style="width:100px;"></figure>'
                }
                if(this.stringifiedChatData[i].message){
                chatdata += '<div class="mail-users right-side">\
                                  <div class="rgt-user-chat">\
                                      <p>'+this.stringifiedChatData[i].message+'</p>\
                                  </div>\
                              </div>';
                }
            }

            
            jQuery("#chatbox1").append(chatdata);

          }
          this.tot_ele = this.stringifiedChatData.length;
          this.scrollToBottom();

    }

    ngOnInit(): void {
       

       this.ChatId = this.activatedRoute.snapshot.params["id"] ;
       this.GetChatData(); 
       setInterval(() => {
          this.firstTime = false;
          this.GetChatData(); 
       }, 10000);

       setInterval(() => {
          location.reload();
       }, 120000);

       
    }


    onChange(event:any) {
        this.file = event.target.files[0];
    }


    
    public GetChatData(){

        


        this.chatDetail = this.commonService.getChatData(this.ChatId).then((res: any) => {
            if(res.status == true) {   
           
                this.stringifiedChatData =  JSON.parse(res.result.message_json);   
                this.ChatType =  res.result.chat_type;   
                this.event_user_id =  res.result.event_user_id;   
                this.to_userId =  this.isLoggedIn == res.result.from_user_id ? res.result.to_user_id : res.result.from_user_id;   
                //console.log(this.stringifiedChatData);   
                

                this.title = res.result.title;
                if(res.result.chat_type == 'u'){
                  this.profileimg = environment.apiUrl+'/uploads/profile/'+res.result.profile_img;
                  this.commonService.setTitle(res.result.first_name);
                  this.headerService.setTitle(res.result.first_name,this.profileimg);
                }else{
                  this.commonService.setTitle(res.result.title);
                  this.headerService.setTitle(res.result.title,'');
                }

                // Append or add data in Chatbox
                this.addElement();
                

                


            }else{
              this.toastr.error('Something weng wrong');
            };
        });
    }

    public submitSend(){

        this.submitted = true;
        
        let body = new FormData();
        body.append('chatId', this.ChatId);
        body.append('message', this.frmSend.value.message);
        body.append('chat_type', this.ChatType);
        body.append('event_user_id', this.event_user_id);
        body.append('from_user_id', this.isLoggedIn);
        body.append('to_user_id', this.to_userId);
        body.append('attached', this.file);
        let options = this.commonService.generateRequestHeadersAuthorise(false,false);

        //let options = this.commonService.generateRequestHeaders(false);
        this.commonService.SubmiPostFormData('postChat',body,options)
        .then((response) => {         
          if(response.status == true){
            this.frmSend.reset();
            this.stringifiedChatData =  JSON.parse(response.result.message_json);  
            this.addElement();
            return true;
          }else{            
            return false;
          }  
        }).catch((error) => {
          this.toastr.error('Something weng wrong');
          return false;
        });

    }

   

  

    actionRequest(actiontype:any,reqId:any){
        console.log(actiontype);
        console.log(reqId);
        this.postRequestAcceptReject(actiontype,reqId);

    }

    postRequestAcceptReject(actiontype: any, reqId: any) {
      let body = {
        message: reqId,
        chat_type: actiontype,
        from_user_id: actiontype,
        to_user_id: actiontype
      };      

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        this.commonService.postList('postChat',body,options).subscribe((res: any) => {
        if(res.status == true) {               
            this.toastr.success(res.result);
            
            return true;
        }else{
          this.toastr.error('Something weng wrong');
          return false;

        }
      });
    }
}
