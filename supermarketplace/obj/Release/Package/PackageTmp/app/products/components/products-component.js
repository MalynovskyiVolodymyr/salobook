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
var angular2_notifications_1 = require('angular2-notifications');
var product_service_1 = require('./../services/product-service');
var user_service_1 = require('./../services/user-service');
var ProductsComponent = (function () {
    function ProductsComponent(productService, userService, _service, _push) {
        var _this = this;
        this.productService = productService;
        this.userService = userService;
        this._service = _service;
        this._push = _push;
        this.categories = [];
        this.activeControll = 0;
        this.options = {
            timeOut: 3000,
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
        this.conneciton = $.hubConnection();
        this.proxy = this.conneciton.createHubProxy("Messanger");
        this.proxy = this.conneciton.createHubProxy("Messanger");
        this.proxy.on("friendRequest", function (resp) {
            _this.createNotification('info', (JSON.parse(resp))['UserName'], 'new friend request');
        });
        this.proxy.on("removeFriendRequest", function (resp) {
            _this.createNotification('error', (JSON.parse(resp))['UserName'], 'removed his friend request');
        });
        this.proxy.on("addFriend", function (resp) {
            _this.createNotification('success', (JSON.parse(resp))['UserName'], 'accepted your frined request');
        });
        this.proxy.on("sendMessage", function (resp) {
            _this.createNotification('info', 'new message', 'you have new message');
        });
        this.proxy.on("removeFriend", function (resp) {
            _this.createNotification('error', (JSON.parse(resp))['UserName'], 'removed you from his friends');
        });
        this.conneciton.start().done(function (resp) {
            var message = "test";
        });
    }
    ProductsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.animLoaderStart();
        this.productService.getListOfCategories()
            .then(function (data) {
            _this.animLoaderStop();
            _this.categories = JSON.parse(data);
        }).catch(function (err) {
            _this.animLoaderStop();
            _this.createNotification('error', 'warning', 'Internet connection error');
        });
    };
    ProductsComponent.prototype.createNotification = function (messageType, fromUser, messageInfo) {
        switch (messageType) {
            case 'success':
                var a = this._service.success(fromUser, messageInfo);
                break;
            case 'alert':
                this._service.alert(fromUser, messageInfo);
                break;
            case 'error':
                this._service.error(fromUser, messageInfo);
                break;
            case 'info':
                this._service.info(fromUser, messageInfo);
                break;
            case 'bare':
                this._service.bare(fromUser, messageInfo);
                break;
        }
    };
    ProductsComponent.prototype.animLoaderStart = function () {
        var anime = $('.animator.remove-loader');
        if (anime != undefined) {
            anime.removeClass('remove-loader');
        }
    };
    ProductsComponent.prototype.animLoaderStop = function () {
        var anime = $('.animator');
        if (anime != undefined) {
            anime.addClass('remove-loader');
        }
    };
    ProductsComponent.prototype.active = function (menuItem) {
        this.activeControll = menuItem.Id;
    };
    ProductsComponent.prototype.checkIfLoggedIn = function () {
        return this.userService.checkIfAuthorize();
    };
    ProductsComponent.prototype.ngOnDestroy = function () {
        this.conneciton.stop();
    };
    ProductsComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/products/components/products-component.html'
        }), 
        __metadata('design:paramtypes', [product_service_1.Productservice, user_service_1.UserService, angular2_notifications_1.NotificationsService, angular2_notifications_1.PushNotificationsService])
    ], ProductsComponent);
    return ProductsComponent;
}());
exports.ProductsComponent = ProductsComponent;
