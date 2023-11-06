import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HeaderMobileComponent } from './header-mobile/header-mobile.component';
import { FooterComponent } from './footer/footer.component';
import { FooterMobileComponent } from './footer-mobile/footer-mobile.component';
import { ProfileMenuMobileComponent } from './profile-menu-mobile/profile-menu-mobile.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ListRequestsComponent } from './list-requests/list-requests.component';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { MyActivitiesComponent } from './my-activities/my-activities.component';
import { MyInboxComponent } from './my-inbox/my-inbox.component';
import { AlertService, AuthenticationService, UserService } from './_services';
import { LogoutModule } from './logout/logout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingScreenComponent } from './landing-screen/landing-screen.component';
import { EditProfileAppComponent } from './edit-profile-app/edit-profile-app.component';
//import { CommonService } from './_services/common.service';
import { LoadingDirective } from './loading/loading.directive';
/* Third Party Installation */
import { ToastrModule } from 'ngx-toastr';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingInterceptor } from './loading.interceptor';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { ActivitiesComponent } from './activities/activities.component';


import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ListParticipatedComponent } from './list-participated/list-participated.component';
import { UpcomingActivitiesComponent } from './upcoming-activities/upcoming-activities.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChatDetailComponent } from './chat-detail/chat-detail.component';
import { HeaderService } from './header.service';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditActivityComponent } from './edit-activity/edit-activity.component';
import { NgSelectModule } from '@ng-select/ng-select';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UrlService } from './url.service';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';
import { CmspagesComponent } from './cmspages/cmspages.component';
import { ActivityTypeListComponent } from './activity-type-list/activity-type-list.component';
/* Third Party Installation */
import { AdsenseModule } from 'ng2-adsense';
import { ContactusComponent } from './contactus/contactus.component';
// export function  commonServiceFactory(commonService: CommonService): Function {
//   return () => commonService.load();
// }
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from '../environments/environment';

import { GooglePlaceModule } from "ngx-google-places-autocomplete";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeaderMobileComponent,
    FooterComponent,
    FooterMobileComponent,
    ProfileMenuMobileComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    MyprofileComponent,
    AccountSettingsComponent,
    ListRequestsComponent,
    AddActivityComponent,
    MyActivitiesComponent,
    MyInboxComponent,
    LandingScreenComponent,
    EditProfileAppComponent,
    LoadingDirective,
    SpinnerComponent,
    SplashScreenComponent,
    ActivitiesComponent,
    ActivityDetailComponent,
    ListParticipatedComponent,
    UpcomingActivitiesComponent,
    ForgotPasswordComponent,
    ChatDetailComponent,
    ViewProfileComponent,
    EditActivityComponent,
    VerifyemailComponent,
    CmspagesComponent,
    ActivityTypeListComponent,
    ContactusComponent,
  ],
  imports: [
    GooglePlaceModule,
    RecaptchaV3Module,
    ShareButtonsModule,
    ShareIconsModule,
    NgSelectModule,
    NgxMatTimepickerModule,
    HttpClientModule,
    BrowserModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AdsenseModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      progressBar: true,
      closeButton:false,
      toastClass:'ngx-toastr',
      easing:'ease-out',
      enableHtml:true
    }),
    BrowserAnimationsModule,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },
    // CommonService,
    // {
    //     provide: APP_INITIALIZER,
    //     useFactory: commonServiceFactory,
    //     deps: [CommonService],
    //     multi: true
    // },
    UrlService,
    AlertService,
    AuthenticationService,
    UserService,
    HeaderService,
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
