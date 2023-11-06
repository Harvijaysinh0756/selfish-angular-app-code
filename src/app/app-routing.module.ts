import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ListRequestsComponent } from './list-requests/list-requests.component';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { MyActivitiesComponent } from './my-activities/my-activities.component';
import { ActivitiesComponent } from './activities/activities.component';
import { MyInboxComponent } from './my-inbox/my-inbox.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileMenuMobileComponent } from './profile-menu-mobile/profile-menu-mobile.component';
import { LandingScreenComponent } from './landing-screen/landing-screen.component';
import { EditProfileAppComponent } from './edit-profile-app/edit-profile-app.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ListParticipatedComponent } from './list-participated/list-participated.component';
import { UpcomingActivitiesComponent } from './upcoming-activities/upcoming-activities.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChatDetailComponent } from './chat-detail/chat-detail.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditActivityComponent } from './edit-activity/edit-activity.component';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';
import { CmspagesComponent } from './cmspages/cmspages.component';
import { ActivityTypeListComponent } from './activity-type-list/activity-type-list.component';
import { ContactusComponent } from './contactus/contactus.component';

const routes: Routes = [
  {
    path:'',
    component:  window.screen.width > 767 ? HomeComponent : LandingScreenComponent
    //component:HomeComponent
  },
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'contactus',
    component:ContactusComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'cms/:cmsslug',
    component:CmspagesComponent
  },
  {
    path:'verify-email/:emailverifycode',
    component:VerifyemailComponent
  },
  {
    path:'forgot-password',
    component:ForgotPasswordComponent
  },
  {
    path:'signup',
    component:SignupComponent
  },
  {
    path:'myprofile',
    component:MyprofileComponent
  },
  {
    path:'viewprofile/:id',
    component:ViewProfileComponent
  },
  {
    path:'account-settings',
    component:AccountSettingsComponent
  },
  {
    path:'list-requests/:id',
    component:ListRequestsComponent
  },
  {
    path:'list-participated/:id',
    component:ListParticipatedComponent
  },
  {
    path:'add-activity',
    component:AddActivityComponent
  },
  {
    path:'update-activity/:slug',
    component:EditActivityComponent
  },
  {
    path:'my-activities',
    component:MyActivitiesComponent
  },
  {
    path:'my-upcoming-activities',
    component:UpcomingActivitiesComponent
  },
  {
    path:'activities',
    component:ActivitiesComponent
  },
  {
    path:'activity-type/:typeofactivity',
    component:ActivityTypeListComponent
  },
  {
    path:'activity/:slug',
    component:ActivityDetailComponent
  },
  {
    path:'activities/:keyword:location',
    component:ActivitiesComponent
  },
  {
    path:'my-inbox',
    component:MyInboxComponent
  },
  {
    path:'chat-detail/:id',
    component:ChatDetailComponent
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path:'profile-menu-mobile',
    component:ProfileMenuMobileComponent
  },
  {
    path:'landing-screen',
    component:LandingScreenComponent
  },
  {
    path:'edit-profile-app',
    component:EditProfileAppComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
