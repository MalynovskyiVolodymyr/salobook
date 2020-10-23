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
var AddsEditComponent = (function () {
    function AddsEditComponent(router, addsService) {
        this.router = router;
        this.addsService = addsService;
        this.itemToEdit = null;
        this.categories = [];
        this.itemToEdit = JSON.parse(sessionStorage.getItem('tempData'));
        sessionStorage.removeItem('tempData');
    }
    AddsEditComponent.prototype.updateAddsInfo = function () {
        var _this = this;
        this.addsService.updateAddsInfo(this.itemToEdit).then(function (data) {
            _this.itemToEdit = JSON.parse(data);
        });
    };
    AddsEditComponent.prototype.updateAdds = function () {
        var _this = this;
        var formData = new FormData();
        var xmlhttp = new XMLHttpRequest();
        formData.append("Id", this.itemToEdit.Id);
        if (this.innerItemfiles != undefined) {
            formData.append("bannerItemfiles", this.innerItemfiles[0], this.innerItemfiles[0].name);
        }
        else {
            formData.append("bannerItemfiles", 0);
        }
        if (this.backroundfiles != undefined) {
            formData.append("backroundfiles", this.backroundfiles[0], this.backroundfiles[0].name);
        }
        else {
            formData.append("backroundfiles", 0);
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    _this.itemToEdit = JSON.parse(xmlhttp.response);
                }
                else {
                }
                $('#backroundInput').val("");
                $('#innerInput').val("");
                _this.innerItemfiles = null;
                _this.backroundfiles = null;
            }
        };
        xmlhttp.open('POST', '/adminaction/UpdateAddsImage');
        xmlhttp.send(formData);
    };
    AddsEditComponent.prototype.onInnerItemChange = function (event) {
        this.innerItemfiles = event.srcElement.files;
    };
    AddsEditComponent.prototype.onBackroundChange = function (event) {
        this.backroundfiles = event.srcElement.files;
    };
    AddsEditComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/account/components/adds-edit-component.html',
            animations: [router_animation_1.routerTransition()],
            host: { '[@routerTransition]': '' }
        }),
        __metadata("design:paramtypes", [router_1.Router, user_adds_service_1.Addsservice])
    ], AddsEditComponent);
    return AddsEditComponent;
}());
exports.AddsEditComponent = AddsEditComponent;
