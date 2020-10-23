"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/Rx');
var UserAccountService = (function () {
    function UserAccountService(http) {
        this.http = http;
    }
    UserAccountService.prototype.getUserMenu = function () {
        return this.http.get('/accountaction/UserAccountData')
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserAccountService.prototype.getUserFriendMenu = function (userFriend) {
        return this.http.post('/accountaction/GetUserFriendProfileData', userFriend)
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserAccountService.prototype.getUserProducts = function (pageNumber) {
        return this.http.post('/accountaction/GetUserProducts', pageNumber)
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserAccountService.prototype.getUserFriendsAndMessages = function (pageNum) {
        if (pageNum === void 0) { pageNum = 1; }
        return this.http.post('/accountaction/GetUserProfileData', pageNum)
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserAccountService.prototype.getUserFriendsData = function () {
        return this.http.get('/accountaction/GetUserFriendsData')
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserAccountService.prototype.saveUserInfo = function (userInfo) {
        sessionStorage.removeItem('userInfo');
        sessionStorage.setItem('userInfo', userInfo);
    };
    UserAccountService.prototype.saveUserFriends = function (userFriends) {
        sessionStorage.removeItem('userFriends');
        sessionStorage.setItem('userFriends', userFriends);
    };
    UserAccountService.prototype.getUserFriends = function () {
        return sessionStorage.getItem('userFriends');
    };
    UserAccountService.prototype.getUserInfo = function () {
        return sessionStorage.getItem('userInfo');
    };
    UserAccountService.prototype.userFriendReguest = function (user) {
        return this.http.post('/accountaction/FriendRequest', user)
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserAccountService.prototype.userRemoveFreindRequest = function (user) {
        return this.http.post('/accountaction/RemoveFriendRequest', user)
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserAccountService.prototype.userAddNewFriend = function (user) {
        return this.http.post('/accountaction/AddNewFriend', user)
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserAccountService.prototype.userRemoveFriend = function (user) {
        return this.http.post('/accountaction/RemoveFriend', user)
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserAccountService.prototype.searchForUsers = function (username) {
        return this.http.post('/accountaction/SearchForFriends', { input: username })
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserAccountService.prototype.logout = function () {
        return this.http.get('/accountaction/LogOut')
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserAccountService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UserAccountService);
    return UserAccountService;
}());
exports.UserAccountService = UserAccountService;
