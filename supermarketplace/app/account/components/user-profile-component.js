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
var user_profile_service_1 = require("./../services/user-profile-service");
var user_account_service_1 = require("./../services/user-account-service");
var angular2_notifications_1 = require("angular2-notifications");
var router_animation_1 = require("./../../animation/router-animation");
var UserProfileComponent = (function () {
    function UserProfileComponent(router, userProfileService, userAccountService, _service, _push) {
        var _this = this;
        this.router = router;
        this.userProfileService = userProfileService;
        this.userAccountService = userAccountService;
        this._service = _service;
        this._push = _push;
        this.profileToEdit = {
            UserName: "",
            Password: "",
            NewPassword: "",
            NewPasswordConfirm: "",
            UserBackgroundImage: "",
            ImgUrl: ""
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
        this.categories = [];
        this.conneciton = $.hubConnection();
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
    UserProfileComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.userAccountService.getUserFriendsAndMessages()
            .then(function (data) {
            if (data != "") {
                _this.profileToEdit = JSON.parse(data);
            }
            else {
                _this.createNotification('error', 'warning', 'Internet connection error');
            }
        }).catch(function (err) {
            _this.createNotification('error', 'warning', 'Internet connection error');
        });
    };
    UserProfileComponent.prototype.createNotification = function (messageType, fromUser, messageInfo) {
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
    UserProfileComponent.prototype.updateUserProfilepassword = function () {
        var _this = this;
        if (this.profileToEdit.Password == undefined || this.profileToEdit.NewPassword == undefined || this.profileToEdit.NewPassword !== this.profileToEdit.NewPasswordConfirm) {
            this.createNotification('error', 'warning', 'passwords are empty or do not match');
            return;
        }
        this.profileToEdit.UserName = "";
        this.profileToEdit.UserBackgroundImage = 0;
        this.profileToEdit.ImgUrl = 0;
        this.animLoaderStart();
        this.userProfileService.updateUserProfile(this.profileToEdit).then(function (data) {
            if (data != "") {
                _this.animLoaderStop();
                _this.profileToEdit = JSON.parse(data);
            }
            else {
                _this.animLoaderStop();
                _this.createNotification('error', 'warning', 'incorrect password');
            }
        }).catch(function (err) {
            _this.animLoaderStop();
            _this.createNotification('error', 'warning', 'Internet connection error');
        });
    };
    UserProfileComponent.prototype.updateUserName = function () {
        var _this = this;
        if (this.profileToEdit.UserName == undefined) {
            this.createNotification('error', 'warning', 'enter your new name');
            return;
        }
        this.profileToEdit.NewPassword = "";
        this.profileToEdit.Password = "";
        this.profileToEdit.NewPasswordConfirm = "";
        this.profileToEdit.ImgUrl = 0;
        this.profileToEdit.UserBackgroundImage = 0;
        this.animLoaderStart();
        this.userProfileService.updateUserProfile(this.profileToEdit).then(function (data) {
            if (data != "") {
                _this.animLoaderStop();
                _this.profileToEdit = JSON.parse(data);
            }
            else {
                _this.animLoaderStop();
                _this.createNotification('error', 'warning', 'Internet connection error');
            }
        }).catch(function (err) {
            _this.animLoaderStop();
            _this.createNotification('error', 'warning', 'Internet connection error');
        });
    };
    UserProfileComponent.prototype.updateProfilePictures = function () {
        var _this = this;
        if (this.innerItemfiles == undefined && this.backroundfiles == undefined) {
            this.createNotification('error', 'warning', 'chose picture to send');
            return;
        }
        var formData = new FormData();
        var xmlhttp = new XMLHttpRequest();
        formData.append("UserName", "");
        formData.append("Password", "");
        formData.append("NewPassword", "");
        formData.append("NewPasswordConfirm", "");
        if (this.innerItemfiles != undefined) {
            formData.append("ImgUrl", this.innerItemfiles[0], this.innerItemfiles[0].name);
        }
        else {
            formData.append("ImgUrl", 0);
        }
        if (this.backroundfiles != undefined) {
            formData.append("UserBackgroundImage", this.backroundfiles[0], this.backroundfiles[0].name);
        }
        else {
            formData.append("UserBackgroundImage", 0);
        }
        this.animLoaderStart();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    _this.animLoaderStop();
                    try {
                        _this.profileToEdit = JSON.parse(xmlhttp.response);
                    }
                    catch (err) {
                        _this.createNotification('error', 'warning', 'image size must be less than 500 kb');
                    }
                }
                else {
                    _this.animLoaderStop();
                }
                _this.animLoaderStop();
                $('#backroundInput').val("");
                $('#innerInput').val("");
                _this.innerItemfiles = null;
                _this.backroundfiles = null;
            }
        };
        xmlhttp.open('POST', '/accountaction/UpdateUserProfile');
        xmlhttp.send(formData);
    };
    UserProfileComponent.prototype.onInnerItemChange = function (event) {
        this.innerItemfiles = event.srcElement.files;
        var _innerItemPreview = this.innerItemPreview;
        var reader = new FileReader();
        reader.onload = function (e) {
            _innerItemPreview(e.target['result']);
        };
        reader.readAsDataURL(this.innerItemfiles[0]);
    };
    UserProfileComponent.prototype.animLoaderStart = function () {
        var anime = $('.animator.remove-loader');
        if (anime != undefined) {
            anime.removeClass('remove-loader');
        }
    };
    UserProfileComponent.prototype.animLoaderStop = function () {
        var anime = $('.animator');
        if (anime != undefined) {
            anime.addClass('remove-loader');
        }
    };
    UserProfileComponent.prototype.onBackroundChange = function (event) {
        this.backroundfiles = event.srcElement.files;
        var _backgroundItemPreview = this.backgroundItemPreview;
        var reader = new FileReader();
        reader.onload = function (e) {
            _backgroundItemPreview(e.target['result']);
        };
        reader.readAsDataURL(this.backroundfiles[0]);
    };
    UserProfileComponent.prototype.innerItemPreview = function (imageUrl) {
        $('#innerImage').attr('src', imageUrl);
    };
    UserProfileComponent.prototype.backgroundItemPreview = function (imageUrl) {
        $('#backgroundImage').attr('src', imageUrl);
    };
    UserProfileComponent.prototype.ngOnDestroy = function () {
        this.conneciton.stop();
    };
    UserProfileComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/account/components/user-profile-component.html',
            animations: [router_animation_1.routerTransition()],
            host: { '[@routerTransition]': '' }
        }),
        __metadata("design:paramtypes", [router_1.Router, user_profile_service_1.UserProfileService, user_account_service_1.UserAccountService, angular2_notifications_1.NotificationsService, angular2_notifications_1.PushNotificationsService])
    ], UserProfileComponent);
    return UserProfileComponent;
}());
exports.UserProfileComponent = UserProfileComponent;
