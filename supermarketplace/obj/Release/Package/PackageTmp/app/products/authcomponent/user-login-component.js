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
var forms_1 = require('@angular/forms');
var angular2_notifications_1 = require('angular2-notifications');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
var user_service_1 = require('./../services/user-service');
var router_animation_1 = require('./../../animation/router-animation');
var UserLoginComponent = (function () {
    function UserLoginComponent(formBuilder, http, router, userservice, _service, _push) {
        this.formBuilder = formBuilder;
        this.http = http;
        this.router = router;
        this.userservice = userservice;
        this._service = _service;
        this._push = _push;
        this.options = {
            timeOut: 4000,
            lastOnBottom: true,
            clickToClose: true,
            maxLength: 0,
            maxStack: 7,
            showProgressBar: true,
            pauseOnHover: true,
            preventDuplicates: false,
            preventLastDuplicates: 'visible',
            rtl: false,
            animate: 'scale',
            position: ['right', 'top']
        };
        this.title = 'Warning';
        this.content = 'tour password is incorrect or the user does not exists';
        this.email = new forms_1.FormControl('', [forms_1.Validators.required]);
        this.password = new forms_1.FormControl('', [forms_1.Validators.required]);
        this.coolForm = formBuilder.group({
            email: this.email,
            password: this.password
        });
    }
    UserLoginComponent.prototype.create = function () {
        this._service.error(this.title, this.content);
    };
    UserLoginComponent.prototype.animLoaderStart = function () {
        var anime = $('.animator.remove-loader');
        if (anime != undefined) {
            anime.removeClass('remove-loader');
        }
    };
    UserLoginComponent.prototype.animLoaderStop = function () {
        var anime = $('.animator');
        if (anime != undefined) {
            anime.addClass('remove-loader');
        }
    };
    UserLoginComponent.prototype.authorize = function () {
        var _this = this;
        if (this.coolForm.value["email"].length == 0 || this.coolForm.value["password"].length == 0) {
            return;
        }
        this.animLoaderStart();
        this.userservice.authenticate(this.coolForm.value).then(function (response) {
            _this.animLoaderStop();
            if (_this.userservice.checkIfAuthorize()) {
                _this.router.navigateByUrl('/account');
            }
            else {
                _this.create();
            }
        }).catch(function (err) {
            _this.animLoaderStop();
            _this.create();
        });
    };
    UserLoginComponent.prototype.ngOnDestroy = function () {
        if (!undefined === this.sub) {
            this.sub.unsubscribe();
        }
    };
    UserLoginComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/products/authcomponent/user-login-component.html',
            animations: [router_animation_1.routerTransition()],
            host: { '[@routerTransition]': '' }
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder, http_1.Http, router_1.Router, user_service_1.UserService, angular2_notifications_1.NotificationsService, angular2_notifications_1.PushNotificationsService])
    ], UserLoginComponent);
    return UserLoginComponent;
}());
exports.UserLoginComponent = UserLoginComponent;
