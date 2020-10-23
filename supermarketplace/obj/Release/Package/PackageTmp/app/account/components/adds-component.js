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
var user_adds_service_1 = require('./../services/user-adds-service');
var router_animation_1 = require('./../../animation/router-animation');
var AddsComponent = (function () {
    function AddsComponent(addsService) {
        this.addsService = addsService;
    }
    AddsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.addsService.getListOfAdds().then(function (data) {
            _this.addsItems = JSON.parse(data);
        });
    };
    AddsComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/account/components/adds-component.html',
            animations: [router_animation_1.routerTransition()],
            host: { '[@routerTransition]': '' }
        }), 
        __metadata('design:paramtypes', [user_adds_service_1.Addsservice])
    ], AddsComponent);
    return AddsComponent;
}());
exports.AddsComponent = AddsComponent;
