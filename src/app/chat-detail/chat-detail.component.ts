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
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

declare var jQuery: any;
declare var require: any
const FileSaver = require('file-saver');

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
    profileName : any;
    //file: File ;
    file: any ;
    public isLoggedIn : any;
    public userData : any = [];
    public stringifiedData : any = [];
    public stringifiedChatData : any = [];
    AllListParticipate: any = [];
    notfound = false;
    loading = false;
    selectedFiles?: FileList;
    currentFile?: File;
    chatImgPreview : String;
    ChatPdfDoc : String;
    ChatPdfDocName : String;
    isDisableBtn = false;
    ischatAvailable :any ;
    @ViewChild('fileInput', {static: false})
    myFileInput: ElementRef;

    
    @ViewChild('chatbox') div: ElementRef;
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    constructor(
      private http: HttpClient,
      private elementRef:ElementRef,
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

        if( !localStorage.getItem("auth_token") ){
          this.router.navigate(['/login']);
        }

      }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }

    ngAfterViewChecked (){
      if(this.elementRef.nativeElement.querySelector('.my-downloadBtn')){
        this.elementRef.nativeElement.querySelector('.my-downloadBtn').addEventListener('click', this.downloadPdf.bind(this));
      }
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
            //console.log(this.stringifiedChatData);
          for (let i = 0; i < finaltotal; i++) {      
            chatdata = '';
            //console.log(this.stringifiedChatData[i].from_userImg);
            
            if(this.stringifiedChatData[i].from_user_id != this.isLoggedIn){
                
                if(this.stringifiedChatData[i].video){
                      var fileName = this.stringifiedChatData[i].video;
                      var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1); 
                      var file_name = fileName.split('/').pop();
                      
                      if(fileExtension == 'pdf'){
                        chatdata = '<div class="mail-users left-side">\
                                        <div class="lft-user-img">\
                                          <img src="'+environment.apiUrl+'/uploads/profile/'+this.stringifiedChatData[i].from_userImg+'" alt="" class="mCS_img_loaded">\
                                        </div>\
                                        <div class="rgt-user-chat">\
                                           <h4>'+this.stringifiedChatData[i].from_userName+'</h4>\
                                           <a href="'+fileName+'"  style="cursor:pointer" download class="my-downloadBtn"\
                                            (click)="downloadPdf('+fileName+')">\
                                              <p><img src="assets/images-nct/pdf.svg" style="width:50px;"></p>\
                                           </a>\
                                        </div>\
                                    </div>';
                      }else if(fileExtension == 'doc'){
                        chatdata = '<div class="mail-users left-side">\
                                        <div class="lft-user-img">\
                                          <img src="'+environment.apiUrl+'/uploads/profile/'+this.stringifiedChatData[i].from_userImg+'" alt="" class="mCS_img_loaded">\
                                        </div>\
                                        <div class="rgt-user-chat">\
                                            <h4>'+this.stringifiedChatData[i].from_userName+'</h4>\
                                            <a href="'+fileName+'"  style="cursor:pointer" class="my-downloadBtn"\ (click)="downloadPdf('+fileName+')">\
                                              <p><img src="assets/images-nct/msoffice.svg" style="width:50px;"></p>\
                                          </a>\
                                        </div>\
                                    </div>';
                      }else if(fileExtension == 'mp4'){
                        chatdata = '<div class="mail-users left-side">\
                                        <div class="lft-user-img">\
                                          <img src="'+environment.apiUrl+'/uploads/profile/'+this.stringifiedChatData[i].from_userImg+'" alt="" class="mCS_img_loaded">\
                                        </div>\
                                        <div class="rgt-user-chat">\
                                            <h4>'+this.stringifiedChatData[i].from_userName+'</h4>\
                                            <a href="'+fileName+'"  style="cursor:pointer" class="my-downloadBtn"\ (click)="downloadPdf('+fileName+')">\
                                              <p><img src="assets/images-nct/video_icon.svg" style="width:50px;"></p>\
                                          </a>\
                                        </div>\
                                    </div>';
                      }else{
                        chatdata = '<div class="mail-users left-side">\
                                        <div class="lft-user-img">\
                                          <img src="'+environment.apiUrl+'/uploads/profile/'+this.stringifiedChatData[i].from_userImg+'" alt="" class="mCS_img_loaded">\
                                        </div>\
                                        <div class="rgt-user-chat">\
                                            <h4>'+this.stringifiedChatData[i].from_userName+'</h4>\
                                            <p><img src="'+this.stringifiedChatData[i].image+'" style="width:100px;"></p>\
                                        </div>\
                                    </div>';
                      }
                }
                if(this.stringifiedChatData[i].image){
                  //chatdata = '<figure><img src="'+this.stringifiedChatData[i].image+'" style="width:100px;"></figure>'
                  chatdata = '<div class="mail-users left-side">\
                                  <div class="lft-user-img">\
                                    <img src="'+environment.apiUrl+'/uploads/profile/'+this.stringifiedChatData[i].from_userImg+'" alt="" class="mCS_img_loaded">\
                                  </div>\
                                  <div class="rgt-user-chat">\
                                      <h4>'+this.stringifiedChatData[i].from_userName+'</h4>\
                                      <p><img src="'+this.stringifiedChatData[i].image+'" style="width:100px;"></p>\
                                  </div>\
                              </div>';
                }
                if(this.stringifiedChatData[i].message){
                chatdata += '<div class="mail-users left-side">\
                                  <div class="lft-user-img">\
                                    <img src="'+environment.apiUrl+'/uploads/profile/'+this.stringifiedChatData[i].from_userImg+'" alt="" class="mCS_img_loaded">\
                                  </div>\
                                  <div class="rgt-user-chat">\
                                      <h4>'+this.stringifiedChatData[i].from_userName+'</h4>\
                                      <p>'+this.stringifiedChatData[i].message+'</p>\
                                  </div>\
                              </div>';
                }
            }else{

                if(this.stringifiedChatData[i].image){
                  chatdata = '<div class="mail-users right-side">\
                                  <div class="rgt-user-chat">\
                                      <p><img src="'+this.stringifiedChatData[i].image+'" style="width:100px;"></p>\
                                  </div>\
                              </div>';
                }

                if(this.stringifiedChatData[i].video){
                  var fileName = this.stringifiedChatData[i].video;
                  var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1); 
                  var file_name = fileName.split('/').pop();
                  
                  if(fileExtension == 'pdf'){
                    chatdata = '<div class="mail-users right-side">\
                                    <div class="rgt-user-chat">\
                                    <a href="'+fileName+'"  style="cursor:pointer" download class="my-downloadBtn"\
                                     (click)="downloadPdf('+fileName+')">\
                                       <p><img src="assets/images-nct/pdf.svg" style="width:50px;"></p>\
                                    </a>\
                                    </div>\
                                </div>';
                  }else if(fileExtension == 'doc'){
                    chatdata = '<div class="mail-users right-side">\
                                    <div class="rgt-user-chat">\
                                        <a href="'+fileName+'"  style="cursor:pointer" class="my-downloadBtn"\ (click)="downloadPdf('+fileName+')">\
                                          <p><img src="assets/images-nct/msoffice.svg" style="width:50px;"></p>\
                                      </a>\
                                    </div>\
                                </div>';
                  }else if(fileExtension == 'mp4'){
                    chatdata = '<div class="mail-users right-side">\
                                    <div class="rgt-user-chat">\
                                        <a href="'+fileName+'"  style="cursor:pointer" class="my-downloadBtn"\ (click)="downloadPdf('+fileName+')">\
                                          <p><img src="assets/images-nct/video_icon.svg" style="width:50px;"></p>\
                                      </a>\
                                    </div>\
                                </div>';
                  }else{
                    chatdata = '<div class="mail-users right-side">\
                                    <div class="rgt-user-chat">\
                                        <p><img src="'+this.stringifiedChatData[i].image+'" style="width:100px;"></p>\
                                    </div>\
                                </div>';
                  }
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

    downloadPdf(pdfUrl: any ) {


      console.log(pdfUrl);
    //   const URL = "https://selfwish.ncryptedprojects.com/admin/uploads/chat/64abe3f84c7c0.pdf";

    // this.http.get(URL, { responseType: "arraybuffer" }).subscribe(
    //   pdf => {
    //     const blob = new Blob([pdf], { type: "application/pdf" });
    //     const fileName = "rohit.pdf";
    //     FileSaver.saveAs(blob, fileName);
    //   },
    //   err => {
    //     console.log("err->", err);
    //   }
    // );

       //pdfUrl = 'https://selfwish.ncryptedprojects.com/admin/uploads/chat/64abf08557168.doc';
      let pdfName = 'your_pdf_file';
      //const pdfUrl = './assets/sample.pdf';
      //const pdfName = 'your_pdf_file';
      console.log(pdfUrl);
      //FileSaver.saveAs(pdfUrl, pdfName);
    }

    addElementPersonal() {


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

                if(this.stringifiedChatData[i].video){
                  var fileName = this.stringifiedChatData[i].video;
                  var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1); 
                  var file_name = fileName.split('/').pop();
                  
                  if(fileExtension == 'pdf'){
                    chatdata = '<div class="mail-users right-side">\
                                    <div class="rgt-user-chat">\
                                    <a href="'+fileName+'"  style="cursor:pointer" download class="my-downloadBtn"\
                                     (click)="downloadPdf('+fileName+')">\
                                       <p><img src="assets/images-nct/pdf.svg" style="width:50px;"></p>\
                                    </a>\
                                    </div>\
                                </div>';
                  }else if(fileExtension == 'doc'){
                    chatdata = '<div class="mail-users right-side">\
                                    <div class="rgt-user-chat">\
                                        <a href="'+fileName+'"  style="cursor:pointer" class="my-downloadBtn"\ (click)="downloadPdf('+fileName+')">\
                                          <p><img src="assets/images-nct/msoffice.svg" style="width:50px;"></p>\
                                      </a>\
                                    </div>\
                                </div>';
                  }else if(fileExtension == 'mp4'){
                    chatdata = '<div class="mail-users right-side">\
                                    <div class="rgt-user-chat">\
                                        <a href="'+fileName+'"  style="cursor:pointer" class="my-downloadBtn"\ (click)="downloadPdf('+fileName+')">\
                                          <p><img src="assets/images-nct/video_icon.svg" style="width:50px;"></p>\
                                      </a>\
                                    </div>\
                                </div>';
                  }else{
                    chatdata = '<div class="mail-users right-side">\
                                    <div class="rgt-user-chat">\
                                        <p><img src="'+this.stringifiedChatData[i].image+'" style="width:100px;"></p>\
                                    </div>\
                                </div>';
                  }
                }

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
            }else{

                if(this.stringifiedChatData[i].video){
                  var fileName = this.stringifiedChatData[i].video;
                  var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1); 
                  var file_name = fileName.split('/').pop();
                  
                  if(fileExtension == 'pdf'){
                    chatdata = '<div class="mail-users left-side">\
                                    <div class="rgt-user-chat">\
                                    <a href="'+fileName+'"  style="cursor:pointer" download class="my-downloadBtn"\
                                     (click)="downloadPdf('+fileName+')">\
                                       <p><img src="assets/images-nct/pdf.svg" style="width:50px;"></p>\
                                    </a>\
                                    </div>\
                                </div>';
                  }else if(fileExtension == 'doc'){
                    chatdata = '<div class="mail-users left-side">\
                                    <div class="rgt-user-chat">\
                                        <a href="'+fileName+'"  style="cursor:pointer" class="my-downloadBtn"\ (click)="downloadPdf('+fileName+')">\
                                          <p><img src="assets/images-nct/msoffice.svg" style="width:50px;"></p>\
                                      </a>\
                                    </div>\
                                </div>';
                  }else if(fileExtension == 'mp4'){
                    chatdata = '<div class="mail-users left-side">\
                                    <div class="rgt-user-chat">\
                                        <a href="'+fileName+'"  style="cursor:pointer" class="my-downloadBtn"\ (click)="downloadPdf('+fileName+')">\
                                          <p><img src="assets/images-nct/video_icon.svg" style="width:50px;"></p>\
                                      </a>\
                                    </div>\
                                </div>';
                  }else{
                    chatdata = '<div class="mail-users left-side">\
                                    <div class="rgt-user-chat">\
                                        <p><img src="'+this.stringifiedChatData[i].image+'" style="width:100px;"></p>\
                                    </div>\
                                </div>';
                  }
                }

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
            }

            
            jQuery("#chatbox1").append(chatdata);

          }
          this.tot_ele = this.stringifiedChatData.length;
          this.scrollToBottom();

    }

    public loadScript() {

      var script = document.getElementById("testScriptName");
      jQuery( script ).remove();
    }
    ngOnInit(): void {
       this.loadScript();

       this.ChatId = this.activatedRoute.snapshot.params["id"] ;
       this.checkChatAccess(); 
       
       if(this.ischatAvailable){ 
         setInterval(() => {
            this.firstTime = false;
            this.GetChatData(false); 
         }, 10000);

         setInterval(() => {
            location.reload();
         }, 120000);
       }

       
    }


    removeImg() {
      this.file = undefined;
      this.chatImgPreview = '';
      this.ChatPdfDoc = '';
      this.ChatPdfDocName = '';
      console.log(this.file);
    }
    onChange(event:any) {
        this.file = event.target.files[0];


        this.chatImgPreview = '';
        this.ChatPdfDoc = '';
        this.ChatPdfDocName = '';
        this.selectedFiles = event.target.files;

        if (this.selectedFiles) {
          const file: File | null = this.selectedFiles.item(0);
          if (file) {
            this.chatImgPreview = '';
            this.ChatPdfDoc = '';
            this.currentFile = file;
            this.ChatPdfDocName = '';
            
            console.log(this.currentFile.type);

            if( this.currentFile.type == 'image/jpeg' || this.currentFile.type == 'image/png' || this.currentFile.type == 'image/gif' ){

              const reader = new FileReader();
              reader.onload = (e: any) => {
                this.chatImgPreview = e.target.result;
              };
              reader.readAsDataURL(this.currentFile);

            }else if( this.currentFile.type == 'video/mp4'  ){

              this.ChatPdfDocName = this.currentFile.name;
              this.ChatPdfDoc = 'assets/images-nct/video_icon.svg';

            }else if( this.currentFile.type == 'application/pdf'  ){

              this.ChatPdfDocName = this.currentFile.name;
              this.ChatPdfDoc = 'assets/images-nct/pdf.svg';

            }else if( this.currentFile.type == 'application/msword'  ){

              this.ChatPdfDocName = this.currentFile.name;
              this.ChatPdfDoc = 'assets/images-nct/msoffice.svg';

            }else{
              alert('You can allowed only jpg,png,gif,mp4,pdf and doc file. Rest of file not allowed in chat');
            }

          }
        }
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

      let options = this.commonService.generateRequestHeadersAuthorise(true,false);
        this.commonService.postList('listOfParticipates',body,options).subscribe((res: any) => {
          
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
    public GetChatData(isfirstTime:any){
        this.chatDetail = this.commonService.getChatData(this.ChatId).then((res: any) => {
            if(res.status == true) {   
                
                if(res.result.chat_type == 'e'){
                  this.stringifiedChatData =  JSON.parse(res.chat_json);   
                }else{
                  this.stringifiedChatData =  JSON.parse(res.result.message_json);   
                }

                //this.stringifiedChatData =  JSON.parse(res.result.message_json);   
                this.ChatType =  res.result.chat_type;   
                this.event_user_id =  res.result.event_user_id;   
                this.to_userId =  this.isLoggedIn == res.result.from_user_id ? res.result.to_user_id : res.result.from_user_id;   
                //console.log(this.stringifiedChatData);   
                

                //this.title = res.result.title;
                if(res.result.chat_type == 'u'){
                  // this.profileimg = environment.apiUrl+'/uploads/profile/'+res.result.profile_img;
                  // this.title = res.result.first_name+' '+res.result.last_name;
                  // this.commonService.setTitle(res.result.first_name);
                  // this.headerService.setTitle(res.result.first_name,this.profileimg);
                }else{
                  this.title = res.result.title;
                  this.commonService.setTitle(res.result.title);
                  this.headerService.setTitle(res.result.title,'');
                }

                // Append or add data in Chatbox
                if(this.ChatType == 'e'){
                  this.addElement();
                }else{
                  this.addElementPersonal();
                }
                if(isfirstTime){
                  this.getListParticipate(this.event_user_id);
                }
                

                


            }else{
              this.toastr.error('Something weng wrong');
            };
        });
    }

    public submitSend(){

        this.submitted = true;
        if( (this.frmSend.value.message != '' && this.frmSend.value.message != null) || this.file != undefined ){
          
          
          

          let body = new FormData();
          body.append('chatId', this.ChatId);
          if(this.frmSend.value.message == null){
            body.append('message', '');
          }else{
            body.append('message', this.frmSend.value.message);            
          }
          body.append('chat_type', this.ChatType);
          body.append('event_user_id', this.event_user_id);
          body.append('from_user_id', this.isLoggedIn);
          body.append('to_user_id', this.to_userId);
          body.append('attached', this.file);
          let options = this.commonService.generateRequestHeadersAuthorise(false,false);
          this.isDisableBtn = true;
          this.loading = true;
          //let options = this.commonService.generateRequestHeaders(false);
          this.commonService.SubmiPostFormData('postChat',body,options)
          .then((response) => {         
            if(response.status == true){
              this.file = undefined;
              this.frmSend.reset();
              this.chatImgPreview = '';
              this.ChatPdfDoc = '';
              this.stringifiedChatData =  JSON.parse(response.result.message_json);  
              this.firstTime = false;
              this.loading = false;
              this.isDisableBtn = false;
              //this.addElement();
              if(this.ChatType == 'e'){
                  this.addElement();
                }else{
                  this.addElementPersonal();
                }
              return true;
            }else{            
              return false;
            }  
          }).catch((error) => {
            this.loading = false;
            this.isDisableBtn = false;
            this.toastr.error('Something weng wrong');
            return false;
          });

        }

    }


    checkChatAccess() {
      let body = {
        chat_id: this.ChatId,
        userid: this.isLoggedIn
      };      

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        this.commonService.postList('checkChatAccess',body,options).subscribe((res: any) => {
        if(res.status == true) { 
            this.profileimg = environment.apiUrl+'/uploads/profile/'+res.result.profile_img;
            this.title = res.result.first_name+' '+res.result.last_name;
            this.commonService.setTitle(res.result.first_name);
            this.headerService.setTitle(res.result.first_name,this.profileimg);
            this.GetChatData(true);              
            return true;
        }else{
          this.toastr.error(res.err);
          this.router.navigate(['/home']);
          return false;

        }
      });
    }
   


    
}
