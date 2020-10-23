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
var angular2_notifications_1 = require("angular2-notifications");
var user_account_service_1 = require("./../services/user-account-service");
var user_products_service_1 = require("./../services/user-products-service");
var UserFriendComponent = (function () {
    function UserFriendComponent(userAccountService, userProductsService, _service, _push) {
        var _this = this;
        this.userAccountService = userAccountService;
        this.userProductsService = userProductsService;
        this._service = _service;
        this._push = _push;
        this.userInfo = {
            UserId: 1,
            UserEmail: "",
            DateCreated: new Date(),
            UserName: "",
            UserBackgroundImage: "",
            ImgUrl: "",
            MyProducts: { ProductsPerPage: [], CountOfPages: 1 },
        };
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
        this.activePageNum = 1;
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
    UserFriendComponent.prototype.animLoaderStart = function () {
        var anime = $('.animator.remove-loader');
        if (anime != undefined) {
            anime.removeClass('remove-loader');
        }
    };
    UserFriendComponent.prototype.animLoaderStop = function () {
        var anime = $('.animator');
        if (anime != undefined) {
            anime.addClass('remove-loader');
        }
    };
    UserFriendComponent.prototype.createNotification = function (messageType, fromUser, messageInfo) {
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
    UserFriendComponent.prototype.ngAfterViewInit = function () {
        this.initUserAccountPage();
    };
    UserFriendComponent.prototype.initUserAccountPage = function () {
        var _this = this;
        var userFriend = JSON.parse(sessionStorage.getItem("friendData"));
        userFriend['DateCreated'] = new Date();
        this.animLoaderStart();
        this.userAccountService.getUserFriendMenu(userFriend).then(function (response) {
            if (response != "") {
                _this.animLoaderStop();
                _this.userInfo = JSON.parse(response);
                _this.mapUserInfo();
            }
            else {
                _this.createNotification('error', 'warning', 'Internet connection error');
            }
        }).catch(function (err) {
            _this.createNotification('error', 'warning', 'Internet connection error');
        });
    };
    UserFriendComponent.prototype.active = function (pageNumber) {
        var _this = this;
        this.activePageNum = pageNumber + 1;
        this.animLoaderStart();
        this.userProductsService.getUserFriendProducts({ page: this.activePageNum, category: this.userInfo.UserId }).then(function (response) {
            delete _this.userProducts;
            delete _this.userInfo.MyProducts;
            _this.userInfo.MyProducts = JSON.parse(response);
            _this.userProducts = _this.userInfo.MyProducts.ProductsPerPage;
            _this.animLoaderStop();
        }).catch(function (err) {
            _this.createNotification('error', 'warning', 'Internet connection error');
        });
    };
    UserFriendComponent.prototype.mapUserInfo = function () {
        this.userProducts = this.userInfo.MyProducts.ProductsPerPage;
        this.pageCounter = this.userInfo.MyProducts.CountOfPages;
        this.pages = [];
        for (var i = 0; i < this.pageCounter; ++i) {
            this.pages.push(i);
        }
        if (this.pages.length == 0) {
            this.pages.push(0);
        }
    };
    UserFriendComponent.prototype.ngOnDestroy = function () {
        this.conneciton.stop();
    };
    UserFriendComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/account/components/user-friend-component.html'
        }),
        __metadata("design:paramtypes", [user_account_service_1.UserAccountService, user_products_service_1.UserProductsService, angular2_notifications_1.NotificationsService, angular2_notifications_1.PushNotificationsService])
    ], UserFriendComponent);
    return UserFriendComponent;
}());
exports.UserFriendComponent = UserFriendComponent;
