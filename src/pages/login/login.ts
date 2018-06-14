import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { AuthService } from '../../providers/auth-service';
import { DialogService } from '../../providers/dialog-service';
import { NavController, MenuController, Platform } from 'ionic-angular';
import { NgForm } from "@angular/forms";

declare var cordova;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(
  	private nav: NavController,
    private menuCtlr: MenuController,
  	private auth: AuthService,
    private dialog: DialogService,
    public platform: Platform
  ) {
    this.menuCtlr.swipeEnable(false);
  }

  public login(form: NgForm) {

	  let credentials = {email: form.value.email, password: form.value.password};

    this.dialog.showLoading("Efetuando o Login...");
    this.auth.login(credentials).subscribe(allowed => {

      this.dialog.loading.dismiss();

      if (allowed) {
        this.nav.setRoot(HomePage);
      } else {
        this.dialog.showAlert("Erro ao efetuar login", "Por favor, verifique os dados de acesso!");
      }
    },
    error => {
      this.dialog.loading.dismiss();
      this.dialog.showAlert("Erro ao efetuar login", error);
    });
  }

  forgotPassword(){
    this.platform.ready().then(() => {
      cordova.InAppBrowser.open("http://www.impulsoti.com.br",'_self', "location=yes");
    });
  }


}
