import { Component , ViewChild, ElementRef } from '@angular/core';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { CommonService } from '../_services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent {


      public frmContactus: FormGroup;  
      loading = false;
      
      submitted = false;
      isDisableBtn = false;
     
      constructor(
      public formBuilder: FormBuilder,
      public commonService:CommonService,
      private headerService: HeaderService,
      private deviceDetectorService: DeviceDetectorService,
      public activatedRoute:ActivatedRoute,
      public toastr : ToastrService,
      public router:Router) {


        this.frmContactus = formBuilder.group({
          'first_name' : ['', [Validators.required]],
          'last_name' : ['', [Validators.required]],
          'email': ['', [Validators.required,Validators.email,this.emailValidator]],
          'mobile' : ['', [Validators.required,Validators.minLength(10),Validators.maxLength(15)]],
          'purpose' : ['', [Validators.required]],
          'message' : ['', [Validators.required]]
        });

    }


    emailValidator(control:any) {
      if (control.value) {
        const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
        return matches ? null : { 'invalidEmail': true };
      } else {
        return null;
      }
    }

    ngOnInit(): void {
       
    }
   
    get f() { return this.frmContactus.controls; }
    submitContactUsForm(){


            this.submitted = true;

            // stop here if form is invalid
            if (this.frmContactus.invalid) {
                return;
            }
            this.isDisableBtn = true;
            this.loading = true;
            let body = new FormData();
            body.append('first_name', this.frmContactus.value.first_name);
            body.append('last_name', this.frmContactus.value.last_name);
            body.append('email', this.frmContactus.value.email);
            body.append('mobile', this.frmContactus.value.mobile);
            body.append('purpose', this.frmContactus.value.purpose);
            body.append('message', this.frmContactus.value.message);

            let options = this.commonService.generateRequestHeaders(false);

            this.commonService.SubmiPostFormData('contactus',body,options)
            .then((response) => {   

              if(response.status == true){
                this.frmContactus.reset();
                this.toastr.success(response.msg);
                this.loading = false;
                this.submitted = false;
                //this.router.navigate(['/home']);
                return true;
              }else{
                
                this.toastr.error(response.msg);                
                this.loading = false;
                this.isDisableBtn = false;
                return false;

              } 

            }).catch((error) => {
              this.toastr.error('Something weng wrong');
              this.loading = false;
              this.isDisableBtn = false;
              return false;
            });
    }


}
