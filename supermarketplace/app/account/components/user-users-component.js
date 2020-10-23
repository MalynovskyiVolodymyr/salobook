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
var user_users_service_1 = require("./../services/user-users-service");
var router_animation_1 = require("./../../animation/router-animation");
var UserManageUsers = (function () {
    function UserManageUsers(usersService) {
        this.usersService = usersService;
        this.users = [];
        this.pages = [];
        this.activePageNum = 1;
    }
    UserManageUsers.prototype.ngAfterViewInit = function () {
        this.getUsers();
    };
    UserManageUsers.prototype.activePager = function (pageNumber) {
        this.activePageNum = pageNumber + 1;
        this.getUsers();
    };
    UserManageUsers.prototype.getUsers = function () {
        var _this = this;
        this.usersService.getAllUsers(this.activePageNum)
            .then(function (data) {
            var responce = JSON.parse(data);
            _this.users = [];
            _this.users = responce.UsersPerPage;
            _this.pageCounter = responce.CountOfPages;
            _this.pages = [];
            for (var i = 0; i < _this.pageCounter; ++i) {
                _this.pages.push(i);
            }
            if (_this.pages.length == 0) {
                _this.pages.push(0);
            }
            console.log(_this.pageCounter);
            console.log(_this.pages);
        }).catch(function (error) {
            console.log('in user-prod-com => ', error);
        });
    };
    UserManageUsers = __decorate([
        core_1.Component({
            templateUrl: "app/account/components/user-users-component.html",
            animations: [router_animation_1.routerTransition()],
            host: { '[@routerTransition]': '' }
        }),
        __metadata("design:paramtypes", [user_users_service_1.UserUsersService])
    ], UserManageUsers);
    return UserManageUsers;
}());
exports.UserManageUsers = UserManageUsers;
