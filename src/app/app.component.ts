import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, NavController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { AuthService } from '../providers/auth-service';
import { DialogService } from '../providers/dialog-service';
import { User } from '../models/user';

@Component({
  templateUrl: 'app.html'
})
export class MyApp{

  public rootPage;
  homePage = HomePage;

  @ViewChild('nav') nav: NavController;

  constructor(
    public platform: Platform,
    statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private authService: AuthService,
    private menuCtrl: MenuController,
    private dialog: DialogService,
    private events: Events
   ) {
    platform.ready().then(() => {

      statusBar.styleDefault();

      this.authService.loadUserFromStorage().then((user: User) => {
        if (user){
          this.rootPage = HomePage;
        }else{
          this.rootPage = LoginPage;
        }
      });

      this.hideSplashScreen();

      this.subscribeEvents();

    });


  }


  subscribeEvents(){
    this.events.subscribe("token_error", () =>{
      this.authService.logout().subscribe( (logged_out) => {
        if (logged_out){
          if (this.dialog.loading){
            this.dialog.loading.dismiss();
          }
          this.onLoad(LoginPage);
          this.dialog.showToast("Sessão expirada. Favor efetuar login novamente!");
        }
      });
    });

  }


  //fix for blank screen page after splash
  hideSplashScreen() {
    if (this.splashScreen) {
      setTimeout(() => {
      this.splashScreen.hide();
      }, 100);
    }
  }

  onLoad(page){
    this.menuCtrl.close();
    this.nav.setRoot(page);
  }


  onLogout() {
    this.authService.logout().subscribe( (logged_out) => {
      if (logged_out){
        this.onLoad(LoginPage);
      }
    });
  }

}
