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
var router_1 = require("@angular/router");
var user_adds_service_1 = require("./../services/user-adds-service");
var router_animation_1 = require("./../../animation/router-animation");
var AdvertisingModel = (function () {
    function AdvertisingModel() {
    }
    return AdvertisingModel;
}());
var AddsNewComponent = (function () {
    function AddsNewComponent(router, addsService) {
        this.router = router;
        this.addsService = addsService;
        this.item = {
            Title: "",
            InnerText: "",
            BackroundImage: null,
            InnerImage: null
        };
    }
    AddsNewComponent.prototype.saveAddsInfo = function () {
        var _this = this;
        var formData = new FormData();
        var xmlhttp = new XMLHttpRequest();
        formData.append("Title", this.item.Title);
        formData.append("InnerText", this.item.InnerText);
        if (this.item.BackroundImage != undefined) {
            formData.append("InnerImage", this.item.InnerImage[0], this.item.InnerImage[0].name);
        }
        else {
            formData.append("InnerImage", 0);
        }
        if (this.item.BackroundImage != undefined) {
            formData.append("BackroundImage", this.item.BackroundImage[0], this.item.BackroundImage[0].name);
        }
        else {
            formData.append("BackroundImage", 0);
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    if (JSON.parse(xmlhttp.response)) {
                        _this.router.navigate(['/account/advertaising']);
                    }
                }
                else {
                }
                $('#backroundInput').val("");
                $('#innerInput').val("");
                _this.item.InnerImage = null;
                _this.item.BackroundImage = null;
            }
        };
        xmlhttp.open('POST', '/adminaction/CreateNewAdvertising');
        xmlhttp.send(formData);
    };
    AddsNewComponent.prototype.saveAddsImage = function () {
    };
    AddsNewComponent.prototype.onBackroundChange = function (event) {
        this.item.BackroundImage = event.srcElement.files;
    };
    AddsNewComponent.prototype.onInnerItemChange = function (event) {
        this.item.InnerImage = event.srcElement.files;
    };
    AddsNewComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/account/components/adds-create-component.html',
            animations: [router_animation_1.routerTransition()],
            host: { '[@routerTransition]': '' }
        }),
        __metadata("design:paramtypes", [router_1.Router, user_adds_service_1.Addsservice])
    ], AddsNewComponent);
    return AddsNewComponent;
}());
exports.AddsNewComponent = AddsNewComponent;
