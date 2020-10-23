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
var router_1 = require('@angular/router');
var user_products_service_1 = require('./../services/user-products-service');
var router_animation_1 = require('./../../animation/router-animation');
var UserEditComponent = (function () {
    function UserEditComponent(router, productService) {
        this.router = router;
        this.productService = productService;
        this.itemToEdit = null;
        this.categories = [];
        this.itemToEdit = JSON.parse(sessionStorage.getItem('tempData'));
        sessionStorage.removeItem('tempData');
    }
    UserEditComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.productService.getListOfCategories().then(function (categories) {
            _this.categories = JSON.parse(categories);
        }).catch(function (error) {
        });
    };
    UserEditComponent.prototype.makeFileRequest = function () {
        var _this = this;
        var formData = new FormData(), xhr = new XMLHttpRequest();
        formData.append("Id", this.itemToEdit.Id);
        formData.append("Title", this.itemToEdit.Title);
        formData.append("DateCreated", new Date().toDateString());
        formData.append("Description", this.itemToEdit.Description);
        formData.append("UserId", this.itemToEdit.UserId);
        formData.append("ImgUrl", this.itemToEdit.ImgUrl);
        formData.append("CategoryId", this.itemToEdit.CategoryId);
        if (this.files != undefined) {
            formData.append("image", this.files[0], this.files[0].name);
        }
        else {
            formData.append("image", 0);
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log(xhr.response);
                    _this.itemToEdit = JSON.parse(xhr.response);
                }
                else {
                    console.log('image size must be less than 500 kb');
                }
            }
        };
        xhr.open('POST', '/adminaction/UpdateProductImage');
        xhr.send(formData);
    };
    UserEditComponent.prototype.productPreview = function (imageUrl) {
        $('#itemImagePreview').attr('src', imageUrl);
    };
    UserEditComponent.prototype.onChange = function (event) {
        this.files = event.srcElement.files;
        var _productPreview = this.productPreview;
        var reader = new FileReader();
        reader.onload = function (e) {
            _productPreview(e.target['result']);
        };
        reader.readAsDataURL(this.files[0]);
    };
    UserEditComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/account/components/user-product-edit-component.html',
            animations: [router_animation_1.routerTransition()],
            host: { '[@routerTransition]': '' }
        }), 
        __metadata('design:paramtypes', [router_1.Router, user_products_service_1.UserProductsService])
    ], UserEditComponent);
    return UserEditComponent;
}());
exports.UserEditComponent = UserEditComponent;
