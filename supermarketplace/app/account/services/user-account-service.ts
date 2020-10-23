import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class UserAccountService {
    constructor(private http: Http) {

    }

    getUserMenu() {
        return this.http.get('/accountaction/UserAccountData')
            .map(response => response.text()).toPromise();
    }

    getUserFriendMenu(userFriend) {
        return this.http.post('/accountaction/GetUserFriendProfileData', userFriend)
            .map(response => response.text()).toPromise();        
    }

    getUserProducts(pageNumber) {
        return this.http.post('/accountaction/GetUserProducts', pageNumber)
            .map(response => response.text()).toPromise();
    } 

    getUserFriendsAndMessages(pageNum:number = 1) {
        return this.http.post('/accountaction/GetUserProfileData', pageNum)
            .map(response => response.text()).toPromise();
    }

    getUserFriendsData() {
        return this.http.get('/accountaction/GetUserFriendsData')
            .map(response => response.text()).toPromise();
    }

    saveUserInfo(userInfo) {
        sessionStorage.removeItem('userInfo');
        sessionStorage.setItem('userInfo', userInfo);
    }

    saveUserFriends(userFriends) {
        sessionStorage.removeItem('userFriends');
        sessionStorage.setItem('userFriends', userFriends);
    }

    getUserFriends() {
        return sessionStorage.getItem('userFriends');
    }

    getUserInfo() {
        return sessionStorage.getItem('userInfo');
    }

    userFriendReguest(user) {
        return this.http.post('/accountaction/FriendRequest', user)
            .map(response => response.text()).toPromise();
    }

    userRemoveFreindRequest(user) {
        return this.http.post('/accountaction/RemoveFriendRequest', user)
            .map(response => response.text()).toPromise();
    }

    userAddNewFriend(user) {
        return this.http.post('/accountaction/AddNewFriend', user)
            .map(response => response.text()).toPromise();
    }

    userRemoveFriend(user) {
        return this.http.post('/accountaction/RemoveFriend', user)
            .map(response => response.text()).toPromise();
    }

    searchForUsers(username: string) {
        return this.http.post('/accountaction/SearchForFriends', { input: username })
            .map(response => response.text()).toPromise();
    }

    logout() {
        return this.http.get('/accountaction/LogOut')
            .map(response => response.text()).toPromise();
    }
}