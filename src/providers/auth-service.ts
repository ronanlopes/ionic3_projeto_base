import { User } from "../models/user";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http, Response } from "@angular/http";
import { Storage } from "@ionic/storage";

@Injectable()
export class AuthService {
  private currentUser: User;
  isAuthenticated: boolean = false;

  url_base = "http://localhost:3000/app";

  constructor(
  	private http: Http,
  	private storage: Storage
  ){}

  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Favor informar os dados de login");
    } else {

	    return this.http.post(this.url_base+'/login',
	    	{email: credentials.email, password: credentials.password}
	    )
      .map((response: Response) => response.json())
      .catch((error:any) => Observable.throw(error.json().errors ||
        'Ops, algo deu errado ao processar sua requisição. Verifique sua conexão com a internet ou tente novamente mais tarde!'))
      .do( (user) => {

      	this.setCurrentUser({
          name: user.name,
          email: credentials.email,
          role: user.role,
          auth_token: user.auth_token
        });

      	this.isAuthenticated = true;

    });
    }
  }

  public getCurrentUser() : User {
    return this.currentUser;
  }

  public loadUserFromStorage() {

		return this.storage.get('currentUser')
		.then(
		  (user: User) => {
  		  if(user){
          this.currentUser = user;
  		    this.isAuthenticated = true;
        }
		    return user;
		  }
		);

  }

  private setCurrentUser(user) {
  	this.currentUser = new User(user.name, user.email, user.role, user.auth_token);
  	this.storage.set('currentUser', this.currentUser);
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      this.isAuthenticated = false;
      this.storage.set('currentUser', null);
      observer.next(true);
      observer.complete();
    });
  }
}