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
    const div: HTMLParagraphElement = this.renderer.createElement('div');
    var chatdata = '';
    
    let oldTotData = this.stringifiedChatData.length;
    console.log(this.stringifiedChatData);
    
    
    console.log(oldTotData);
    console.log(this.tot_ele);
    this.tot_ele = this.stringifiedChatData.length;

    console.log(this.stringifiedChatData.reverse());

    let array = [1,2,3];
    for (let i = 0; i < array.length; i++) {
      console.log(array[i]);
    }

    this.stringifiedChatData.forEach( (element:any,index:any) => {
        
      var dates_as_int = Date.parse(element.created_at);
      var current_dates_as_int = Date.parse(  new Date().toJSON("yyyy/MM/dd HH:mm") );
      console.log("Message =  "+element.message);
      console.log("index =  "+index);
        
        
        if(this.firstTime){

          if(element.from_user_id == this.isLoggedIn){
              chatdata = '<figure><img src="'+element.image+'" style="width:100px;"></figure>'
              chatdata = '<div class="mail-users left-side">\
                                <div class="rgt-user-chat">\
                                    <p>'+element.message+'</p>\
                                </div>\
                            </div>';
          }else{
              chatdata = '<figure><img src="'+element.image+'" style="width:100px;"></figure>'
              chatdata = '<div class="mail-users right-side">\
                                <div class="rgt-user-chat">\
                                    <p>'+element.message+'</p>\
                                </div>\
                            </div>';
          }

        }else{

          

        }
        jQuery("#chatbox1").append(chatdata);
    });

  }

    ngOnInit(): void {
       

       this.ChatId = this.activatedRoute.snapshot.params["id"] ;
       this.GetChatData(); 
       setInterval(() => {
          this.firstTime = false;
          this.GetChatData(); 
       }, 5000);

       
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
                


                this.commonService.setTitle(res.result.title);
                this.headerService.setTitle(res.result.title);

                // Append or add data in Chatbox
                this.addElement();
                this.scrollToBottom();

                


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
        let options = this.commonService.generateRequestHeadersAuthorise(false);

        //let options = this.commonService.generateRequestHeaders(false);
        this.commonService.SubmiPostFormData('postChat',body,options)
        .then((response) => {         
          if(response.status == true){
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
