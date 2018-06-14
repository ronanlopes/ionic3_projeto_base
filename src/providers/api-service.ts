import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http, Response } from "@angular/http";
import { AuthService } from "./auth-service";
import { Events } from 'ionic-angular';

@Injectable()
export class ApiService {

  url_base = "http://localhost:3000/app";

  constructor(
  	private http: Http,
  	private auth: AuthService,
    private events: Events
  ){ }

  get_token(){
  	return (this.auth.getCurrentUser() ? this.auth.getCurrentUser().auth_token : "")
  }

  throw_error(error){
    if (error.status == 403){
      this.events.publish("token_error");
      return Observable.empty<any>();
    }else{
      return Observable.throw(
        error.json().errors ||
        'Ops, algo deu errado ao processar sua requisição. Verifique sua conexão com a internet ou tente novamente mais tarde!'
      );
    }
  }

  public get_dashboard(){
    return this.http.post(this.url_base+"/get_dashboard", { auth_token: this.get_token() })
    .map((response: Response) => ( response.json() ))
    .catch((error:any) => (this.throw_error(error)));
  }


}

