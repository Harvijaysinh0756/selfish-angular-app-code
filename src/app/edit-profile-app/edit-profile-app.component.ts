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
  selector: 'app-edit-profile-app',
  templateUrl: './edit-profile-app.component.html',
  styleUrls: ['./edit-profile-app.component.scss']
})
export class EditProfileAppComponent {

    @ViewChild('closeBtn') closeBtn: ElementRef;
    public frmProfileEdit: FormGroup;
    submitted = false;
    public userProfile : any = [];
    public userData : any = [];
    public stringifiedData : any = [];
    public isLoggedIn : 0;
    storedProfileAvatar: any = [];
    deviceInfo:DeviceInfo;
    file: File ; 
    imagepath : String;
    profileImg : String;

    selectedFiles?: FileList;
    currentFile?: File;
    progress = 0;
    message = '';
    preview = '';
    constructor(
      public commonService:CommonService,
      public formBuilder: FormBuilder,
      private deviceDetectorService: DeviceDetectorService,
      public toastr : ToastrService,
      public authService:AuthenticationService,
      public router:Router) {

      this.frmProfileEdit = formBuilder.group({
          'first_name' : ['', [Validators.required]],
          'last_name' : ['', [Validators.required]],
          'email' : ['', [Validators.required]],
          'about' : ['', [Validators.required]],
          // 'mobile' : ['', [Validators.required,Validators.minLength(10),Validators.maxLength(15)]],
        });

      this.userData = localStorage.getItem("currentUser");
      if(this.userData){
        this.stringifiedData =  JSON.parse(this.userData);  
        //console.log(this.stringifiedData);
        this.isLoggedIn = this.stringifiedData.data.userId;
      }

      //this.userProfile = this.commonService.getProfile(this.isLoggedIn);
      this.imagepath = environment.apiUrl+'/uploads/profile/';
      
      this.commonService.getProfile(this.isLoggedIn)
      .then((data: any) => {
        //console.log(data);
        //console.log(data.result);
        this.userProfile = data.result;
        this.profileImg = this.imagepath+this.userProfile.profile_img;
        
        this.frmProfileEdit = formBuilder.group({
          'first_name' : [this.userProfile.first_name, [Validators.required]],
          'last_name' : [this.userProfile.last_name, [Validators.required]],
          'email' : [this.userProfile.email, [Validators.required]],
          'about' : [this.userProfile.about, [Validators.required]],
          // 'mobile' : [this.userProfile.mobile, [Validators.required,Validators.minLength(10),Validators.maxLength(15)]],
        });
        
      })
      .catch((error: any) => {
        console.log("Promise rejected with " + JSON.stringify(error));
      });

      //console.log(' ===>> ' + this.userProfile);
      //console.log('this.userProfile = ' + this.userProfile.result.user_name);
      //console.log('this.userProfile' + this.userProfile.result.mobile);

    }
    ngOnInit(): void {
       this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
       //console.log('Device = '+this.deviceInfo);
    }

    onChange(event:any) {

          this.message = '';
          this.profileImg = '';
          this.progress = 0;
          this.selectedFiles = event.target.files;

          if (this.selectedFiles) {
            const file: File | null = this.selectedFiles.item(0);

            if (file) {
              this.profileImg = '';
              this.currentFile = file;

              const reader = new FileReader();

              reader.onload = (e: any) => {
                //console.log(e.target.result);
                this.profileImg = e.target.result;
              };

              reader.readAsDataURL(this.currentFile);
            }
          }
        this.file = event.target.files[0];
    }

    get f() { return this.frmProfileEdit.controls; }
    public submitProfileEdit(){
        

        this.submitted = true;

        // stop here if form is invalid
        if (this.frmProfileEdit.invalid) {
            return;
        }

        let body = new FormData();
        body.append('first_name', this.frmProfileEdit.value.first_name);
        body.append('last_name', this.frmProfileEdit.value.last_name);
        body.append('mobile', '0');
        body.append('about', this.frmProfileEdit.value.about);
        body.append('profile_img', this.file);
        //body.append('profile_img', this.commonService.checkVar(this.storedProfileAvatar.fileObject) != '' ? this.storedProfileAvatar.fileObject : '');
        body.append('userId', this.stringifiedData.data.userId);
        let options = this.commonService.generateRequestHeadersAuthorise(false);

        //console.log(options);
        this.commonService.SubmiPostFormData('updateProfile',body,options)
        .then((response) => {          
          if(response.success == true){
            this.userProfile = response.result;
            this.profileImg = this.imagepath+this.userProfile.profile_img;
            this.toastr.success(response.message);
            this.router.navigate(['/myprofile']);
            //this.closeModal();
            return true;
          }else{
            if(response.message != ''){
              this.toastr.error(response.message);        
            }
            return false;
          }  
        }).catch((error) => {
          this.toastr.error('Something weng wrong');
          return false;
        });

    }

    private closeModal(): void {
        this.closeBtn.nativeElement.click();
    }
}
