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
var angular2_notifications_1 = require('angular2-notifications');
var router_animation_1 = require('./../../animation/router-animation');
var UserInfoViewModel = (function () {
    function UserInfoViewModel() {
    }
    return UserInfoViewModel;
}());
var UserFriendsComponent = (function () {
    function UserFriendsComponent(userAccountService, router, _service, _push) {
        var _this = this;
        this.userAccountService = userAccountService;
        this.router = router;
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
            Messages: []
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
        this.conneciton = $.hubConnection();
        this.proxy = this.conneciton.createHubProxy("Messanger");
        this.proxy.on("friendRequest", function (resp) {
            _this.userFriendsRequests.unshift(JSON.parse(resp));
        });
        this.proxy.on("removeFriendRequest", function (resp) {
            _this.excludeUnnesessaryUser(JSON.parse(resp), _this.userFriendsRequests);
        });
        this.proxy.on("addFriend", function (resp) {
            var tempUser = JSON.parse(resp);
            _this.userFriends.unshift(tempUser);
            _this.excludeUnnesessaryUser(tempUser, _this.userMyFriendsRequests);
        });
        this.proxy.on("removeFriend", function (resp) {
            _this.excludeUnnesessaryUser(JSON.parse(resp), _this.userFriends);
        });
        this.proxy.on("sendMessage", function (resp) {
            _this.createNotification(JSON.parse(resp));
        });
        this.conneciton.start().done(function (resp) {
            var message = "test";
        });
    }
    UserFriendsComponent.prototype.animLoaderStart = function () {
        var anime = $('.animator.remove-loader');
        if (anime != undefined) {
            anime.removeClass('remove-loader');
        }
    };
    UserFriendsComponent.prototype.createNotification = function (tempMessage) {
        for (var i = 0; i < this.userFriends.length; i++) {
            if (this.userFriends[i]['UserId'] == tempMessage['UserSenderId']) {
                this._service.info(this.userFriends[i]['UserName'], 'new message');
            }
        }
    };
    UserFriendsComponent.prototype.animLoaderStop = function () {
        var anime = $('.animator');
        if (anime != undefined) {
            anime.addClass('remove-loader');
        }
    };
    UserFriendsComponent.prototype.sendUserFriendRequest = function (user) {
        var _this = this;
        this.animLoaderStart();
        user['DateCreated'] = new Date();
        this.userAccountService.userFriendReguest(user).then(function (data) {
            _this.animLoaderStop();
            if (data != "") {
                var response = JSON.parse(data);
                _this.sendFriendRequest(response["UserEmail"]);
                _this.removeItemFromArray(response, _this.userFrinedSearchResult);
                _this.userMyFriendsRequests.unshift(response);
            }
        }).catch(function (err) {
            _this.animLoaderStop();
            _this._service.error('warning', 'Internet connection error');
        });
    };
    UserFriendsComponent.prototype.sendFriendRequest = function (userEmail) {
        this.proxy.invoke("SendFriedsRequest", JSON.stringify(this.currentUserInfo), userEmail);
    };
    UserFriendsComponent.prototype.removeUserFriend = function (friendToRemove) {
        var _this = this;
        this.animLoaderStart();
        friendToRemove['DateCreated'] = new Date();
        this.userAccountService.userRemoveFriend(friendToRemove).then(function (data) {
            _this.animLoaderStop();
            if (data != "") {
                var tempUser = JSON.parse(data);
                _this.removeUserFriendReg(tempUser["UserEmail"]);
                _this.excludeUnnesessaryUser(JSON.parse(data), _this.userFriends);
            }
        }).catch(function (err) {
            _this.animLoaderStop();
            _this._service.error('warning', 'Internet connection error');
        });
    };
    UserFriendsComponent.prototype.removeUserFriendReg = function (userEmail) {
        this.proxy.invoke("RemoveFromFriends", JSON.stringify(this.currentUserInfo), userEmail);
    };
    UserFriendsComponent.prototype.removeFriendRequest = function (requestToRemove) {
        var _this = this;
        this.animLoaderStart();
        requestToRemove['DateCreated'] = new Date();
        this.userAccountService.userRemoveFreindRequest(requestToRemove).then(function (data) {
            _this.animLoaderStop();
            if (data != "") {
                var tempUser = JSON.parse(data);
                _this.removeFriedRequest(tempUser["UserEmail"]);
                _this.excludeUnnesessaryUser(tempUser, _this.userMyFriendsRequests);
            }
        }).catch(function (err) {
            _this.animLoaderStop();
            _this._service.error('warning', 'Internet connection error');
        });
    };
    UserFriendsComponent.prototype.removeFriedRequest = function (userEmail) {
        this.proxy.invoke("RemoveFriedsRequest", JSON.stringify(this.currentUserInfo), userEmail);
    };
    UserFriendsComponent.prototype.addNewFriend = function (newFriend) {
        var _this = this;
        this.animLoaderStart();
        newFriend['DateCreated'] = new Date();
        this.userAccountService.userAddNewFriend(newFriend).then(function (data) {
            _this.animLoaderStop();
            if (data != "") {
                var tempUser = JSON.parse(data);
                _this.userFriends.unshift(tempUser);
                _this.addNewUserRequest(tempUser["UserEmail"]);
                _this.excludeUnnesessaryUser(tempUser, _this.userFriendsRequests);
            }
        }).catch(function (err) {
            _this.animLoaderStop();
            _this._service.error('warning', 'Internet connection error');
        });
    };
    UserFriendsComponent.prototype.addNewUserRequest = function (userEmail) {
        this.proxy.invoke("AddToFriends", JSON.stringify(this.currentUserInfo), userEmail);
    };
    UserFriendsComponent.prototype.excludeUnnesesaryData = function (response) {
        for (var i = 0; i < response.length; i++) {
            if (response[i].UserEmail == this.userInfo.UserEmail) {
                this.removeItemFromArray(i, this.userFrinedSearchResult);
            }
            if (this.customIndexOf(response[i], this.userFriendsRequests) || this.customIndexOf(response[i], this.userMyFriendsRequests) || this.customIndexOf(response[i], this.userFriends)) {
                this.removeItemFromArray(i, this.userFrinedSearchResult);
            }
        }
    };
    UserFriendsComponent.prototype.excludeUnnesessaryUser = function (userToRemove, actionArray) {
        for (var i = 0; i < actionArray.length; i++) {
            if (this.customIndexOf(userToRemove, actionArray)) {
                this.removeItemFromArray(i, actionArray);
            }
        }
    };
    UserFriendsComponent.prototype.customIndexOf = function (itemToFind, arrayToSearch) {
        for (var i = 0; i < arrayToSearch.length; i++) {
            if (itemToFind.UserEmail == arrayToSearch[i].UserEmail) {
                return true;
            }
        }
        return false;
    };
    UserFriendsComponent.prototype.initUserAccountPage = function () {
        var _this = this;
        this.animLoaderStart();
        this.userAccountService.getUserFriendsData().then(function (data) {
            _this.animLoaderStop();
            if (data != "") {
                _this.userInfo = JSON.parse(data);
                _this.userFriendsRequests = _this.userInfo.FriendRequests;
                _this.userMyFriendsRequests = _this.userInfo.MyFriendsRequests;
                _this.userFriends = _this.userInfo.Friends;
                if (_this.userFriends.length == 0) {
                    _this.userFriends = JSON.parse(_this.userAccountService.getUserFriends());
                }
                _this.currentUserInfo = {
                    UserId: _this.userInfo.UserId,
                    UserEmail: _this.userInfo.UserEmail,
                    DateCreated: _this.userInfo.DateCreated,
                    UserName: _this.userInfo.UserName,
                    UserBackgroundImage: _this.userInfo.UserBackgroundImage,
                    ImgUrl: _this.userInfo.ImgUrl
                };
            }
        }).catch(function (err) {
            _this.animLoaderStop();
            _this._service.error('warning', 'Internet connection error');
        });
    };
    UserFriendsComponent.prototype.visitFriendPage = function (userFriend) {
        sessionStorage.removeItem("friendData");
        sessionStorage.setItem("friendData", JSON.stringify(userFriend));
        this.router.navigate(['/account/friend']);
    };
    UserFriendsComponent.prototype.removeItemFromArray = function (index, items) {
        items.splice(index, 1);
    };
    UserFriendsComponent.prototype.ngAfterViewInit = function () {
        this.initUserAccountPage();
    };
    UserFriendsComponent.prototype.searchForUsers = function (username) {
        var _this = this;
        this.userAccountService.searchForUsers(username).then(function (data) {
            if (data != "") {
                _this.userFrinedSearchResult = JSON.parse(data);
                _this.excludeUnnesesaryData(_this.userFrinedSearchResult);
            }
            else {
                delete _this.userFrinedSearchResult;
            }
        }).catch(function (err) {
            _this._service.error('warning', 'Internet connection error');
        });
    };
    UserFriendsComponent.prototype.ngOnDestroy = function () {
        this.conneciton.stop();
    };
    UserFriendsComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/account/components/user-friends-component.html',
            animations: [router_animation_1.routerTransition()],
            host: { '[@routerTransition]': '' }
        }), 
        __metadata('design:paramtypes', [user_account_service_1.UserAccountService, router_1.Router, angular2_notifications_1.NotificationsService, angular2_notifications_1.PushNotificationsService])
    ], UserFriendsComponent);
    return UserFriendsComponent;
}());
exports.UserFriendsComponent = UserFriendsComponent;
