import { Component, OnInit } from '@angular/core';
// import { CommonService } from '../../services/common.service';

import { AlertService, AuthenticationService } from '../_services';
import { Router  , ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder ,Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
 

// @Component({
//   selector: 'app-logout',
//   templateUrl: './logout.component.html',
//   styleUrls: ['./logout.component.scss']
// })

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  moduleId:'logout'
})

export class LogoutComponent implements OnInit {   
  public SITE_CONSTANT = [];
  public LANG_CONSTANT = [];
  public moduleId : string = 'logout';
 
  constructor(
    private router :Router,
    // public commonService:CommonService,
    public toastr : ToastrService,
    public authService:AuthenticationService
    ) { 
    // this.SITE_CONSTANT = this.commonService.SITE_CONSTANT;
    // this.LANG_CONSTANT = this.commonService.LANG_CONSTANT;    
    // var setTitle = 'logout - ' + this.SITE_CONSTANT['SITE_NAME'];
    // this.commonService.setTitle(setTitle);
  }  
  
  doLogoutUser(){

    this.authService.removeAuth();
    this.toastr.success('Logout Successfully.');
    this.router.navigate(['login']);

      //return false
    if(this.authService.loggedInUserId != ''){
      console.log('vsdjflsjkfsd');
      // let userid = this.authService.loggedInUserId;
      // let auth_token = this.authService.loggedInUserData.auth_token;

      // let body = {'userid':userid,'auth_token':auth_token};
      // let options = this.commonService.generateRequestHeaders();
      // this.commonService.SubmiPostFormData('logout-user-from-site',body,options)
      // .then((response) => {          
      //   if(response.status == true){
      //       this.toastr.success(this.LANG_CONSTANT['Successfully_logout']);
      //       this.authService.removeAuth();
      //       this.router.navigate(['/signin']);
      //       return true;
      //   }else{
      //     if(response.message != ''){
      //       this.toastr.error(response.message);        
      //     }
      //     return false;
      //   }  
      // }).catch((error) => {
      //   this.toastr.error(this.LANG_CONSTANT['ERROR_MSG']);
      //   return false;
      // });
    }
    else{
      this.router.navigate(['/login']);
    }
  }
  
  ngOnInit() { 
    this.doLogoutUser()   
  }
}