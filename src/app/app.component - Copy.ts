import { Component } from '@angular/core';
import { filter, pairwise, startWith, tap } from 'rxjs/operators';
import { Router, RoutesRecognized } from '@angular/router';

import { UrlService } from './url.service';


import { Platform, NavController, ToastController,AlertController } from '@ionic/angular';

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
  constructor(public toastController: ToastController,private platform: Platform,private router: Router, private urlService: UrlService) {

        // https://stackoverflow.com/questions/55024239/my-hardware-back-button-action-is-not-working-in-ionic-4
         this.platform.backButton.subscribeWithPriority(1, () => {
            console.log('cccccccccccccccccc');

          });

      //this.hardwareBackButton();
      document.addEventListener("backbutton", onBackKeyDown, false);
      function onBackKeyDown() {
          console.log('ffffffffffffffff');

          return false;
      }

      this.platform.ready().then(() => {
          console.log('11111');
        document.addEventListener('backbutton', async () => {
          console.log('2222222222');
            if (this.counter != 0) {
              this.counter++;
              this.alertToast();
              setTimeout(() => { this.counter = 0; }, 3000);
            } else {
               console.log('back click 1111111111111');
               (navigator as any).app.exitApp();
            }
        });
      });

      this.router.events
      .pipe(
        filter((evt: any) => evt instanceof RoutesRecognized),
        tap((x) => console.log(x)),
        startWith({}),
        pairwise(),
        tap((x) => console.log(x))
      )
      .subscribe((events: RoutesRecognized[]) => {
          this.previousUrl = this.currentUrl;
          this.currentUrl = events[1].urlAfterRedirects;
          this.urlService.setPreviousUrl(this.previousUrl);
      });
  }


  hardwareBackButton(){
      this.platform.backButton.subscribe(() =>{

            console.log('back click');
            // if (this.navLinksArray.length > 1){
            //   this.navLinksArray.pop();
            //   const index = this.navLinksArray.length + 1;
            //   const url = this.navLinksArray[index];
            //   this.router.navigate([url]);

            // }
      }) 
  } 

   async alertToast() {
    const toast = await this.toastController.create({
      message: 'Press again to exit',
      duration: 300,
      position: 'middle',
    });
    toast.present();
  }





  
}

