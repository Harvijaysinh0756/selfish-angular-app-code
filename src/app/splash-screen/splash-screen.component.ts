import { Component, OnInit } from "@angular/core";

@Component({
  selector: "splash-screen",
  templateUrl: "./splash-screen.component.html",
  styleUrls: ["./splash-screen.component.css"]
})
export class SplashScreenComponent implements OnInit {
  windowWidth: string;
  showSplash = true;

  constructor() { 
       // it will be null if it doesn't exist
       const isShowSplash = sessionStorage.getItem('isShowSplash');
       if (isShowSplash) {
           // don't show splash 
           this.showSplash = false;
       } else {
           // show splash 
           this.showSplash = true;
       }
       sessionStorage.setItem('isShowSplash', JSON.stringify(false));
  }
  
  ngOnInit(): void {
    setTimeout(() => {
      this.windowWidth = "-" + window.innerWidth + "px";

      setTimeout(() => {
        this.showSplash = !this.showSplash;
      }, 500);
    }, 3000);
  }
}