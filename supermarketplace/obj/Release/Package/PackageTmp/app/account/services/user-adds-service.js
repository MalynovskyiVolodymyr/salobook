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
var Addsservice = (function () {
    function Addsservice(http) {
        this.http = http;
    }
    Addsservice.prototype.getListOfAdds = function () {
        return this.http.get('/homeaction/GetAddsList')
            .map(function (response) { return response.text(); }).toPromise();
    };
    Addsservice.prototype.updateAddsInfo = function (advertising) {
        return this.http.post('/adminaction/UpdateAddsContent', advertising)
            .map(function (response) { return response.text(); }).toPromise();
    };
    Addsservice.prototype.removeAdds = function (advertising) {
        return this.http.post('/adminaction/RemoveAdvertisingItem', advertising)
            .map(function (response) { return response.text(); }).toPromise();
    };
    Addsservice = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], Addsservice);
    return Addsservice;
}());
exports.Addsservice = Addsservice;
