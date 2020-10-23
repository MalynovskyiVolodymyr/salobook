import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import 'rxjs/Rx';

@Injectable()
export class UserProfileService {
    constructor(private http: Http, private _cookieSecive: CookieService) {

    }

    getCaptha() {
        return this.http.get('/homeaction/GetRandomCaptha')
            .map(response => response.text()).toPromise();
    }

    updateUserProfile(userInfo) {
        return this.http.post('/accountaction/UpdateUserProfile', userInfo)
            .map(response => response.text()).toPromise();
    }

    checkIfAuthorize() {
        return this._cookieSecive.get('.ASPXAUTH') && this._cookieSecive.get('.ASPXAUTH').length > 50;
    }

    getAuthorizedData() {
        return JSON.parse(localStorage.getItem('auth-user'));
    }
}