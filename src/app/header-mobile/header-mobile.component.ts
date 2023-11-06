import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { HeaderService } from '../header.service';

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss']
})
export class HeaderMobileComponent {

      isHome = false;
      isRighticon = false;
      isRightSectionImg = false;
      isChatHeader = false;
      ischatImage = false;
      icon_name = '';
      title : any;
      urlSegments : string;
      urlSegmentsNew : string;
      currentComponent :string;
      leftimg = 'assets/images-nct/back-ico.png';
      constructor(private headerService: HeaderService, private activatedRoute: ActivatedRoute,private router: Router,private location: Location ) {

        
        // var snapshot = this.activatedRoute.snapshot;
        // console.log(snapshot.routeConfig);

        this.activatedRoute.url.subscribe((event:any) => {
          this.currentComponent = event[0];
          // console.log('vk='+this.currentComponent); // It's an array remember [0]
          // console.log('vk='+event[0]); // It's an array remember [0]
          // console.log(event[0].path); // e.g. /products
          // console.log(event[0].parameters); // e.g. { id: 'x8klP0' }
        });

        //console.log(this.activatedRoute.['component']['name']);
        //console.log(this.activatedRoute.component['name']);

        //console.log(this.activatedRoute.routeConfig.component.name);
         // this.router.data.subscribe((data: { name: string }) => {
         //    console.log(data);
         //  });
                
         //console.log("vvvvvvvvvvvvvvvvv==============="+this.currentComponent);
          if(this.currentComponent == 'home' ){
              this.leftimg = 'assets/images-nct/logo_only.png';
              this.isRightSectionImg = false; 
              this.isHome = true; 
              this.isRighticon = false; 
              this.title = 'SELFWISH';
              this.icon_name = '';
          }else if(this.currentComponent == 'activities' ){
              this.isRightSectionImg = false; 
              this.isHome = false; 
              this.isRighticon = true; 
              this.title = 'Activities';
              this.icon_name = 'filter-ico.png';
          }else if(this.currentComponent == 'activity-type' ){
              this.headerService.title.subscribe((title: any) => {
                this.title = title;
              });

              this.isRightSectionImg = false; 
              this.isHome = false; 
              this.isRighticon = false; 
              this.title = '';
              this.icon_name = 'filter-ico.png';
          }else if(this.currentComponent == 'account-settings' ){
              this.isRightSectionImg = false; 
              this.isRighticon = false; 
              this.isHome = false; 
              this.title = 'My Account Settings';
              this.icon_name = 'filter-ico.png';
          }else if(this.currentComponent == 'edit-profile-app' ){
              this.isRightSectionImg = false; 
              this.isRighticon = false; 
              this.isHome = false; 
              this.title = 'Edit Profile';
              this.icon_name = 'filter-ico.png';
          }else if(this.currentComponent == 'add-activity' ){
              this.isRightSectionImg = false; 
              this.isRighticon = false; 
              this.isHome = false; 
              this.title = 'Add Activity';
              this.icon_name = '';
          }else if(this.currentComponent == 'my-activities' ){
              this.isRightSectionImg = false; 
              this.isRighticon = false; 
              this.isHome = false; 
              this.title = 'Calendar';
              this.icon_name = '';
          }else if(this.currentComponent == 'activity' ){
              this.isRightSectionImg = false; 
              this.isRighticon = false; 
              this.isHome = false; 
              this.title = 'Activity Detail';
              this.icon_name = '';
          }else if(this.currentComponent == 'cms' ){

              this.headerService.title.subscribe((title: any) => {
                this.title = title;
              });
              this.isRightSectionImg = false; 
              this.isRighticon = false; 
              this.isHome = false; 
              this.title = '';
              this.icon_name = '';
          }else if(this.currentComponent == 'my-inbox' ){
              this.isRightSectionImg = false; 
              this.isRighticon = false; 
              this.isHome = false; 
              this.title = 'My Inbox';
              this.icon_name = '';
          }else if(this.currentComponent == 'chat-detail' ){

              this.headerService.title.subscribe((title: any) => {
                this.title = title;
              });
              this.headerService.profileimg.subscribe((profileimg: any) => {
                this.ischatImage = profileimg;
              });
              this.isChatHeader = true; 
              this.isRightSectionImg = false; 
              this.isRighticon = false; 
              this.isHome = false; 
              //this.title = 'Chat Detail1';
              this.icon_name = '';
          }else if(this.currentComponent == 'my-upcoming-activities' ){
              this.isRightSectionImg = false; 
              this.isRighticon = false; 
              this.isHome = false; 
              this.title = 'My Upcoming Activities';
              this.icon_name = '';
          }else if(this.currentComponent == 'list-requests' ){
              this.isRightSectionImg = false; 
              this.isRighticon = false; 
              this.isHome = false; 
              this.title = 'List of Requests';
              this.icon_name = '';
          }else if(this.currentComponent == 'list-participated' ){
              this.isRightSectionImg = false; 
              this.isRighticon = false; 
              this.isHome = false; 
              this.title = 'List of Participated';
              this.icon_name = '';
          }else if(this.currentComponent == 'viewprofile' ){
              this.isRightSectionImg = false; 
              this.isRighticon = false; 
              this.isHome = false; 
              this.title = 'View Profile';
              this.icon_name = '';
          }else{
              this.isRightSectionImg = true; 
              this.isHome = false;    
              this.isRighticon = true;    
              this.title = 'My Profile';
              this.icon_name = 'edit-ico.png';
          }
          // if(this.isHome )
          // console.log(this.router.url);
      }

      goBack(): void {
          this.location.back(); 
      }
}
