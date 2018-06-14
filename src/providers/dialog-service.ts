import { AlertController, LoadingController, Loading, ToastController } from "ionic-angular";
import { Injectable } from "@angular/core";

@Injectable()
export class DialogService{

	loading: Loading

	constructor(
		private alertCtrl: AlertController,
		private loadingCtrl: LoadingController,
		private toastCtrl: ToastController
	){}


	showLoading(message){
		this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();
	}

	showToast(message) {
	  let toast = this.toastCtrl.create({
	    message: message,
	    duration: 3000,
	    position: 'middle'
	  });

	  toast.present();
	}


  showAlert(title, message){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });

    alert.present();
  }



}