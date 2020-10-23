import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import 'rxjs/Rx';

@Injectable()
export class UserUsersService {
    constructor(private http: Http, private _cookieSecive: CookieService) {

    }

    getAllUsers(page) {
        return this.http.post('/adminaction/ManageUsers', { page: page })
            .map(response => response.text()).toPromise();
    }

    removeUser(user) {
        user['DateCreated'] = new Date();
        return this.http.post('/adminaction/RemoveUser', user)
            .map(response => response.text()).toPromise();
    } 

    forsedAddToFriends(user) {
        user['DateCreated'] = new Date();
        return this.http.post('/adminaction/ForsedAddToFriends', user)
            .map(response => response.text()).toPromise();
    }

    getAllUserControlls() {
        return this.http.get('/adminaction/GetAllControlls')
            .map(response => response.text()).toPromise();
    }  

    updateUserControll(controllToUpdate) {
        return this.http.post('/adminaction/UpdateUserControll', controllToUpdate)
            .map(response => response.text()).toPromise();
    }
}