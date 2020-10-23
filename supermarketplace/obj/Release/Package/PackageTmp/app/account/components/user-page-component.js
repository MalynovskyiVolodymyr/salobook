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
var user_products_service_1 = require('./../services/user-products-service');
var user_message_service_1 = require('./../services/user-message-service');
var angular2_notifications_1 = require('angular2-notifications');
var router_animation_1 = require('./../../animation/router-animation');
var UserPageComponent = (function () {
    function UserPageComponent(userAccountService, userProductsService, userMessageService, _service, _push) {
        var _this = this;
        this.userAccountService = userAccountService;
        this.userProductsService = userProductsService;
        this.userMessageService = userMessageService;
        this._service = _service;
        this._push = _push;
        this.userInfo = {
            UserId: 1,
            UserEmail: "",
            DateCreated: new Date(),
            UserName: "",
            UserBackgroundImage: "",
            ImgUrl: "",
            FriendRequests: [],
            Friends: [],
            MyFriendsRequests: [],
            MyProducts: { ProductsPerPage: [], CountOfPages: 1 },
            Messages: []
        };
        this.modalDialogData = {
            UserId: 1,
            UserEmail: "",
            UserName: "",
            ImgUrl: "",
            userMessages: []
        };
        this.userInput = {
            text: ""
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
        this.modalDialogIndicator = false;
        this.conneciton = $.hubConnection();
        this.proxy = this.conneciton.createHubProxy("Messanger");
        this.proxy.on("sendMessage", function (resp) {
            _this.reciveMessage(resp);
        });
        this.proxy.on("friendRequest", function (resp) {
            var tempUser = JSON.parse(resp);
            _this.createNotification('info', tempUser['UserName'], 'new friend request');
        });
        this.proxy.on("removeFriendRequest", function (resp) {
            var tempUser = JSON.parse(resp);
            _this.createNotification('info', tempUser['UserName'], 'removed his friend request');
        });
        this.proxy.on("addFriend", function (resp) {
            var tempUser = JSON.parse(resp);
            _this.createNotification('success', tempUser['UserName'], 'accepted your friend request');
            _this.userFriends.unshift(tempUser);
            _this.userAccountService.saveUserFriends(JSON.stringify(_this.userFriends));
        });
        this.proxy.on("removeFriend", function (resp) {
            var tempUser = JSON.parse(resp);
            _this.createNotification('alert', tempUser['UserName'], 'has removed you from his friends');
            _this.excludeUnnesessaryUser(tempUser, _this.userFriends);
            _this.userAccountService.saveUserFriends(JSON.stringify(_this.userFriends));
        });
        this.conneciton.start().done(function (resp) {
            var message = "test";
        });
    }
    UserPageComponent.prototype.createNotification = function (messageType, fromUser, messageInfo) {
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
    UserPageComponent.prototype.animLoaderStart = function () {
        var anime = $('.animator.remove-loader');
        if (anime != undefined) {
            anime.removeClass('remove-loader');
        }
    };
    UserPageComponent.prototype.animLoaderStop = function () {
        var anime = $('.animator');
        if (anime != undefined) {
            anime.addClass('remove-loader');
        }
    };
    UserPageComponent.prototype.ngAfterViewInit = function () {
        this.initUserAccountPage();
    };
    UserPageComponent.prototype.initUserAccountPage = function () {
        var _this = this;
        var tempData = this.userAccountService.getUserInfo();
        if (tempData != undefined) {
            this.userInfo = JSON.parse(this.userAccountService.getUserInfo());
            sessionStorage.removeItem("userInfo");
            this.mapUserInfo();
        }
        else {
            this.animLoaderStart();
            this.userAccountService.getUserFriendsAndMessages().then(function (response) {
                delete _this.userInfo;
                _this.animLoaderStop();
                _this.userInfo = JSON.parse(response);
                _this.mapUserInfo();
            }).catch(function (err) {
                _this.createNotification('error', 'warning', 'Internet connection error');
            });
        }
    };
    UserPageComponent.prototype.active = function (pageNumber) {
        var _this = this;
        this.activePageNum = pageNumber + 1;
        this.animLoaderStart();
        this.userProductsService.getUserProducts({ page: this.activePageNum, category: 0 }).then(function (response) {
            delete _this.userProducts;
            delete _this.userInfo.MyProducts;
            _this.userInfo.MyProducts = JSON.parse(response);
            _this.userProducts = _this.userInfo.MyProducts.ProductsPerPage;
            _this.animLoaderStop();
        }).catch(function (err) {
            _this.createNotification('error', 'warning', 'Internet connection error');
        });
    };
    UserPageComponent.prototype.removeProductItem = function (item) {
        var _this = this;
        item["DateCreated"] = new Date();
        this.userProductsService.removeProductAdm(item).then(function (resp) {
            if (resp != "" && JSON.parse(resp)) {
                for (var i = 0; i, _this.userProducts.length; i++) {
                    if (_this.userProducts[i]["Id"] == item["Id"]) {
                        _this.removeItemFromArray(i, _this.userProducts);
                    }
                }
            }
            else {
                console.log('cannot remove item');
            }
        }).catch(function (err) {
            _this.createNotification('error', 'warning', 'Internet connection error');
        });
    };
    UserPageComponent.prototype.excludeUnnesessaryUser = function (userToRemove, actionArray) {
        for (var i = 0; i < actionArray.length; i++) {
            if (this.customIndexOf(userToRemove, actionArray)) {
                this.removeItemFromArray(i, actionArray);
            }
        }
    };
    UserPageComponent.prototype.customIndexOf = function (itemToFind, arrayToSearch) {
        for (var i = 0; i < arrayToSearch.length; i++) {
            if (itemToFind.UserEmail == arrayToSearch[i].UserEmail) {
                return true;
            }
        }
        return false;
    };
    UserPageComponent.prototype.removeItemFromArray = function (index, items) {
        items.splice(index, 1);
    };
    UserPageComponent.prototype.mapUserInfo = function () {
        this.userProducts = this.userInfo.MyProducts.ProductsPerPage;
        this.userFriends = this.userInfo.Friends;
        this.userAccountService.saveUserFriends(JSON.stringify(this.userFriends));
        this.userFriendsReuests = this.userInfo.MyFriendsRequests;
        this.userMessages = this.userInfo.Messages;
        this.requestsToUser = this.userInfo.FriendRequests;
        this.pageCounter = this.userInfo.MyProducts.CountOfPages;
        this.pages = [];
        for (var i = 0; i < this.pageCounter; ++i) {
            this.pages.push(i);
        }
        if (this.pages.length == 0) {
            this.pages.push(0);
        }
    };
    UserPageComponent.prototype.reciveMessage = function (message) {
        var tempMessage = JSON.parse(message);
        if (this.modalDialogIndicator && this.modalDialogData.UserId == tempMessage['UserSenderId'] && this.userInfo.UserId == tempMessage['UserResiverId']) {
            this.modalDialogData.userMessages.push(tempMessage);
            var self_1 = this;
            setTimeout(function () {
                self_1.autoScroller();
            }, 700);
        }
        else {
            this.userMessages.push(tempMessage);
            for (var i = 0; i < this.userFriends.length; i++) {
                if (this.userFriends[i]['UserId'] == tempMessage['UserSenderId']) {
                    this.createNotification('info', this.userFriends[i]['UserName'], 'new message');
                }
            }
        }
    };
    UserPageComponent.prototype.showModalDialog = function (user) {
        this.modalDialogIndicator = true;
        this.modalDialogData = user;
        this.modalDialogData.userMessages = new Array();
        for (var i = 0; i < this.userMessages.length; i++) {
            if (this.userMessages[i].UserResiverId == user.UserId || this.userMessages[i].UserSenderId == user.UserId) {
                this.modalDialogData.userMessages.push(this.userMessages[i]);
            }
        }
        var self = this;
        setTimeout(function () {
            self.autoScroller();
        }, 700);
    };
    UserPageComponent.prototype.onModalClosed = function () {
        this.modalDialogIndicator = false;
    };
    UserPageComponent.prototype.autoScroller = function () {
        var element = document.getElementById('panel-body');
        element.scrollTop = 10000;
    };
    UserPageComponent.prototype.sendMessageToUser = function (message) {
        this.proxy.invoke("SendMessage", JSON.stringify(message), this.modalDialogData.UserEmail);
    };
    UserPageComponent.prototype.sendMessage = function () {
        var _this = this;
        var message = this.userInput.text;
        this.userInput.text = "";
        this.userMessageService.sendMessage({ Id: this.userInfo.UserId, AuthorId: this.userInfo.UserId, UserSenderId: this.userInfo.UserId, UserResiverId: this.modalDialogData.UserId, MessageText: message, DateCreated: new Date() })
            .then(function (data) {
            if (data != "") {
                var temMessage = JSON.parse(data);
                temMessage["DateCreated"] = new Date(parseInt(temMessage["DateCreated"].substring(6)));
                _this.modalDialogData.userMessages.push(temMessage);
                _this.userMessages.push(temMessage);
                _this.sendMessageToUser(temMessage);
                var self_2 = _this;
                setTimeout(function () {
                    self_2.autoScroller();
                }, 700);
            }
        }).catch(function (err) {
            _this.createNotification('error', 'warning', 'Internet connection error');
        });
    };
    UserPageComponent.prototype.ngOnDestroy = function () {
        this.conneciton.stop();
    };
    UserPageComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/account/components/user-page-component.html',
            animations: [router_animation_1.routerTransition()],
            host: { '[@routerTransition]': '' }
        }), 
        __metadata('design:paramtypes', [user_account_service_1.UserAccountService, user_products_service_1.UserProductsService, user_message_service_1.UserMessagesService, angular2_notifications_1.NotificationsService, angular2_notifications_1.PushNotificationsService])
    ], UserPageComponent);
    return UserPageComponent;
}());
exports.UserPageComponent = UserPageComponent;
