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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var core_2 = require("angular2-cookie/core");
require("rxjs/Rx");
var UserUsersService = (function () {
    function UserUsersService(http, _cookieSecive) {
        this.http = http;
        this._cookieSecive = _cookieSecive;
    }
    UserUsersService.prototype.getAllUsers = function (page) {
        return this.http.post('/adminaction/ManageUsers', { page: page })
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserUsersService.prototype.removeUser = function (user) {
        user['DateCreated'] = new Date();
        return this.http.post('/adminaction/RemoveUser', user)
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserUsersService.prototype.forsedAddToFriends = function (user) {
        user['DateCreated'] = new Date();
        return this.http.post('/adminaction/ForsedAddToFriends', user)
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserUsersService.prototype.getAllUserControlls = function () {
        return this.http.get('/adminaction/GetAllControlls')
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserUsersService.prototype.updateUserControll = function (controllToUpdate) {
        return this.http.post('/adminaction/UpdateUserControll', controllToUpdate)
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserUsersService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, core_2.CookieService])
    ], UserUsersService);
    return UserUsersService;
}());
exports.UserUsersService = UserUsersService;
