import { Component,ViewChildren } from '@angular/core';
import { filter, pairwise, startWith, tap } from 'rxjs/operators';
import { Router, RoutesRecognized } from '@angular/router';

import { UrlService } from './url.service';


import { Platform, NavController, ToastController,AlertController,IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Selfwish';
  //isLoading = false;
  previousUrl: string = 'null';
  currentUrl: string = 'null';
  counter = 0;
  currentPage :string;
  navLinksArray = [];
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  public lat : any;
  public lng : any ;

    // @ts-ignore
    @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  constructor(public toastCtrl: ToastController,
    private platform: Platform,private router: Router, 
    private alertCtrl: AlertController,
    private urlService: UrlService) {



       
    

      this.router.events.pipe(
        filter((evt: any) => evt instanceof RoutesRecognized),
        tap((x) => console.log(x)),
        startWith({}),
        pairwise(),
        tap((x) => console.log(x))
      )
      .subscribe((events: RoutesRecognized[]) => {
         console.log('>>>>'+events);
         console.log('>>>>'+events[1].url);
          this.currentPage = events[1].url
          console.log('parmaroaramrar ***============================ '+this.currentPage);
          this.previousUrl = this.currentUrl;
          this.currentUrl = events[1].urlAfterRedirects;
          this.urlService.setPreviousUrl(this.previousUrl);
          this.initializeApp();
      });

      

      

  }
  
  public ngOnInit(): void {
    this.getLocation();
  }

  initializeApp() {    
    this.platform.ready().then(() => {
        //this.hardwareBackButton();
    }).catch(() => {});
  }

  
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          console.log("Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log(this.lat);
          console.log(this.lat);
        }
      },
        (error: any) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  // async presentAlert() {
  //   console.log('dddddddddddd');
  //   let alert = this.alertCtrl.create({
  //     subHeader: 'Low battery',
  //     message: 'This is an alert message.',
  //     buttons: ['Dismiss']
  //   });
  //   (await alert).present();
  // }

  hardwareBackButton(){
      // this.platform.backButton.subscribe(() =>{
      //     this.router.navigate([this.urlService]);
      // }) 

      //console.log('Back buttomn ============================ '+this.currentPage);

      var lastTimeBackPress = 0;
        var timePeriodToExit  = 800;
        this.platform.backButton.subscribe(async ()  =>{
             
            if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                
                navigator['app'].exitApp();

            } else {

                if ( this.currentPage == '/home' || this.currentPage == '/') {
                  navigator['app'].exitApp();
                  const alert = await this.alertCtrl.create({
                    header: 'Are you sure you want Close app?',
                    cssClass: 'alertDanger',
                    buttons: [
                      {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'primary',
                      }, {
                        text: 'Close App',
                        cssClass: 'danger',
                        handler: () => {
                          navigator['app'].exitApp();
                        }
                      }
                    ]
                  });

                  await alert.present();

                }else{

                  navigator['app'].exitApp();
                  this.router.navigate([this.urlService]);
                  //this.openToast('Tap again to exit',800);
                  //lastTimeBackPress = new Date().getTime();

                }
            }
              
        });
  } 

  async openToast(msg:any,time:any) {  
    const toast = await this.toastCtrl.create({  
      message: msg,  
      position : 'bottom',
      translucent : true,
      duration: time  
    });  
    toast.present();  
  } 



  
}

