import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import 'rxjs/Rx';

@Injectable()
export class UserService {
    constructor(private http: Http, private _cookieSecive: CookieService) {

    }

    authenticate(user) {
        return this.http.post('/accountaction/login', { username: user.email, password: user.password })
            .map(response => response.text()).toPromise();
    }

    getCaptha() {
        return this.http.get('/homeaction/GetRandomCaptha')
            .map(response => response.text()).toPromise();
    }

    register(newUser) {
        return this.http.post('/accountaction/RegisterNewUser', newUser)
            .map(response => response.text()).toPromise();
    }

    checkIfAuthorize() {
        return this._cookieSecive.get('.ASPXAUTH') && this._cookieSecive.get('.ASPXAUTH').length > 150;
    }
}