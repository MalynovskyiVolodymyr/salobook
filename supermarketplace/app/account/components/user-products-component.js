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
var user_products_service_1 = require("./../services/user-products-service");
var router_animation_1 = require("./../../animation/router-animation");
var UserManageProducts = (function () {
    function UserManageProducts(productsService) {
        this.productsService = productsService;
        this.products = [];
        this.categories = [];
        this.pages = [];
        this.activePageNum = 1;
    }
    UserManageProducts.prototype.ngAfterViewInit = function () {
        this.getCategories();
    };
    UserManageProducts.prototype.active = function (category) {
        this.currentCategory = category.Id;
        this.getProducts({ page: 1, category: this.currentCategory });
        this.activePageNum = 1;
    };
    UserManageProducts.prototype.activePager = function (pageNumber) {
        this.activePageNum = pageNumber + 1;
        this.getProducts({ page: pageNumber + 1, category: this.currentCategory });
    };
    UserManageProducts.prototype.getCategories = function () {
        var _this = this;
        this.productsService.getListOfCategories()
            .then(function (data) {
            _this.categories = JSON.parse(data);
            _this.currentCategory = _this.categories[0].Id;
            _this.getProducts({ page: 1, category: _this.currentCategory });
        }).catch(function (error) {
            console.log('in user-prod-com => ', error);
        });
    };
    UserManageProducts.prototype.getProducts = function (category) {
        var _this = this;
        this.productsService.getAdminProductsPerPage(category)
            .then(function (data) {
            var responce = JSON.parse(data);
            _this.products = [];
            _this.products = responce.ProductsPerPage;
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
    UserManageProducts = __decorate([
        core_1.Component({
            templateUrl: "app/account/components/user-products-component.html",
            animations: [router_animation_1.routerTransition()],
            host: { '[@routerTransition]': '' }
        }),
        __metadata("design:paramtypes", [user_products_service_1.UserProductsService])
    ], UserManageProducts);
    return UserManageProducts;
}());
exports.UserManageProducts = UserManageProducts;
