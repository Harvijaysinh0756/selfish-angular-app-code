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
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

      cmspagesList: any = [];
      getBannersList: any = [];
      constructor(
      public commonService:CommonService,
      private deviceDetectorService: DeviceDetectorService,
      public router:Router) {


           this.commonService.getCmsPages()
            .then((data: any) => {
                
                this.cmspagesList = data.result;
                //console.log(data.result);
              
            })
            .catch((error: any) => {
              console.log("Promise rejected with " + JSON.stringify(error));
            });

            
            //this.getWithExpiry();
            //const itemStr = localStorage.getItem('bannerStorage');

    }



    getBanners(){
        
        this.commonService.getBanners()
        .then((data: any) => {
                        
            const now = new Date();
            const bannerItem = {
                value: data.data,
                //expiry: now.getTime() + 43200000, // every 12 hours call for banner
                expiry: now.getTime() + 10000, // every 12 hours call for banner
            }
            //console.log('bannerItem' + bannerItem);
            localStorage.setItem('bannerStorage', JSON.stringify(bannerItem));
          
        })
        .catch((error: any) => {
          console.log("Promise rejected with 1 " + JSON.stringify(error));
        });
    }



    getWithExpiry() {
        const itemStr = localStorage.getItem('bannerStorage')

        // if the item doesn't exist, return null
            
        if (!itemStr) {
            this.getBanners();
        }else{

            const item = JSON.parse(itemStr);
            const now = new Date();
            
            // compare the expiry time of the item with the current time
            if (now.getTime() > item.expiry) {
                // If the item is expired, delete the item from storage
                // and return null
                localStorage.removeItem('bannerStorage')
                this.getBanners();
                //this.getBanners();
                return null
            }
            return item.value
        }
    }
}
