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

//import moment from 'moment'

declare var jQuery: any;

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss']
})



export class AddActivityComponent {

    public frmPostEvent: FormGroup;
    public userProfile : any = [];    
    submitted = false;


    notfound = false;
    public userData : any = [];
    public AllEvent : any = [];
    public stringifiedData : any = [];
    public isLoggedIn : 0;
    public SITE_CONSTANT = [];
    categoryList: any = [];
    deviceInfo:DeviceInfo;
    file: File ; 
    imagepath : String;
    eventDt : any;
    sub : any;
    isMenuOpened: String ;

    minDate = new Date();
    //year = this.now.getFullYear();
    //month = this.now.getMonth();
    //day = this.now.getDay();
    //minDate = moment({year: this.year - 100, month: this.month, day: this.day}).format('YYYY-MM-DD');

    constructor(
      public commonService:CommonService,
      public formBuilder: FormBuilder,
      private deviceDetectorService: DeviceDetectorService,
      public toastr : ToastrService,
      public authService:AuthenticationService,
      public activatedRoute:ActivatedRoute,
      public router:Router) {

      this.frmPostEvent = formBuilder.group({
          'category_id' : ['', [Validators.required]],
          'title' : ['', [Validators.required]],
          'location' : ['', [Validators.required]],
          'description' : ['', [Validators.required]],
          'event_date' : ['', [Validators.required]],
          'event_time' : ['', [Validators.required]],
          'image' : ['', [Validators.required]],
        });
      

      

      //maxDate = moment({year: this.year - 16, month: this.month, day: this.day}).format('YYYY-MM-DD');


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

      

      this.getCategory();
      this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
      //console.log('Device = '+this.deviceInfo);

      
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
    

    getCategory(page: number = 1) {
      let body = {
        userid: 0
      };
      this.categoryList = [];
      

      

      let options = this.commonService.generateRequestHeadersAuthorise(false);
        //this.commonService.postList(this.SITE_CONSTANT['API_END_POINT']+'getAllAddedEvent',body,options).subscribe((res: any) => {
        this.commonService.getList('getCategories',options).subscribe((res: any) => {
          console.log(res);
          console.log(res.status);
      
          this.categoryList = res.data;
          setTimeout(() => {
            jQuery('.selectpicker').selectpicker('refresh');
          },1000);
          
      });
    }

    onChange(event:any) {
        this.file = event.target.files[0];
    }
    get f() { return this.frmPostEvent.controls; }
    public submitProfileEdit(){
        
        console.log('submitestd');
        this.submitted = true;

        // stop here if form is invalid
        if (this.frmPostEvent.invalid) {
            return;
        }

        
        // console.log(this.frmPostEvent.value.event_date);
        // var eventdd = new Date("'"+this.frmPostEvent.value.event_date+"'");
        // let date_e = JSON.stringify(eventdd);
        // let final_event_date = date_e.slice(1,11);        
        // console.log(final_event_date);


        let date = new Date(this.frmPostEvent.value.event_date);
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yyyy = date.getFullYear();
        let final_event_date = yyyy + "-" + mm + "-" + dd;


        let body = new FormData();
        body.append('category_id', this.frmPostEvent.value.category_id);
        body.append('title', this.frmPostEvent.value.title);
        body.append('location', this.frmPostEvent.value.location);
        body.append('event_date', final_event_date);
        body.append('event_time', this.frmPostEvent.value.event_time);
        body.append('description', this.frmPostEvent.value.description);
        body.append('image', this.file);
        //body.append('profile_img', this.commonService.checkVar(this.storedProfileAvatar.fileObject) != '' ? this.storedProfileAvatar.fileObject : '');
        body.append('userId', this.stringifiedData.data.userId);
        let options = this.commonService.generateRequestHeadersAuthorise(false);

        console.log(options);
        this.commonService.SubmiPostFormData('addEvent',body,options)
        .then((response) => {          
          if(response.status == true){
            this.userProfile = response.result;
            this.toastr.success(response.message);
            this.router.navigate(['/my-activities']);
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
    
}