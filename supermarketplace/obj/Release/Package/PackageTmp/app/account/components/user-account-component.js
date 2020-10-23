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
var user_account_service_1 = require('./../services/user-account-service');
var router_1 = require('@angular/router');
var user_profile_service_1 = require('./../services/user-profile-service');
var UserInfoViewModel = (function () {
    function UserInfoViewModel() {
    }
    return UserInfoViewModel;
}());
var UserAccountComponent = (function () {
    function UserAccountComponent(userAccountService, router, userService) {
        this.userAccountService = userAccountService;
        this.router = router;
        this.userService = userService;
        this.activeControll = 0;
        this.userInfo = {
            UserName: "",
            UserBackgroundImage: "",
            ImgUrl: ""
        };
    }
    UserAccountComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.userAccountService.getUserMenu()
            .then(function (data) {
            if (data != "") {
                _this.userAccountMenu = JSON.parse(data);
                _this.initUserAccountPage();
            }
        });
    };
    UserAccountComponent.prototype.checkRoute = function () {
        return this.router.url != '/account/friend';
    };
    UserAccountComponent.prototype.logoutUser = function () {
        var _this = this;
        this.userAccountService.logout()
            .then(function (data) {
            localStorage.clear();
            sessionStorage.clear();
            location.replace('/');
            _this.router.navigateByUrl('/products');
        });
    };
    UserAccountComponent.prototype.animLoaderStart = function () {
        var anime = $('.animator.remove-loader');
        if (anime != undefined) {
            anime.removeClass('remove-loader');
        }
    };
    UserAccountComponent.prototype.animLoaderStop = function () {
        var anime = $('.animator');
        if (anime != undefined) {
            anime.addClass('remove-loader');
        }
    };
    UserAccountComponent.prototype.initUserAccountPage = function () {
        var _this = this;
        this.animLoaderStart();
        this.userAccountService.getUserFriendsAndMessages().then(function (data) {
            _this.animLoaderStop();
            if (data != "") {
                _this.userAccountService.saveUserInfo(data);
                _this.userInfo = JSON.parse(data);
                _this.router.navigateByUrl('/account/userpage');
            }
        });
    };
    UserAccountComponent.prototype.active = function (menuItem) {
        this.activeControll = menuItem.Id;
    };
    UserAccountComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/account/components/user-account-component.html'
        }), 
        __metadata('design:paramtypes', [user_account_service_1.UserAccountService, router_1.Router, user_profile_service_1.UserProfileService])
    ], UserAccountComponent);
    return UserAccountComponent;
}());
exports.UserAccountComponent = UserAccountComponent;
