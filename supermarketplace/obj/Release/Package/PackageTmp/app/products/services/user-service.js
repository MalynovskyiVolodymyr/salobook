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
var core_2 = require('angular2-cookie/core');
require('rxjs/Rx');
var UserService = (function () {
    function UserService(http, _cookieSecive) {
        this.http = http;
        this._cookieSecive = _cookieSecive;
    }
    UserService.prototype.authenticate = function (user) {
        return this.http.post('/accountaction/login', { username: user.email, password: user.password })
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserService.prototype.getCaptha = function () {
        return this.http.get('/homeaction/GetRandomCaptha')
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserService.prototype.register = function (newUser) {
        return this.http.post('/accountaction/RegisterNewUser', newUser)
            .map(function (response) { return response.text(); }).toPromise();
    };
    UserService.prototype.checkIfAuthorize = function () {
        return this._cookieSecive.get('.ASPXAUTH') && this._cookieSecive.get('.ASPXAUTH').length > 150;
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, core_2.CookieService])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
