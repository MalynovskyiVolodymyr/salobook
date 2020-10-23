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
var angular2_notifications_1 = require("angular2-notifications");
var user_products_service_1 = require("./../services/user-products-service");
var router_animation_1 = require("./../../animation/router-animation");
var ProductCreateComponent = (function () {
    function ProductCreateComponent(router, productService, _service, _push) {
        var _this = this;
        this.router = router;
        this.productService = productService;
        this._service = _service;
        this._push = _push;
        this.item = {
            Id: 1,
            Title: "",
            DateCreated: null,
            Description: "",
            UserId: 1,
            ImgUrl: "",
            CategoryId: 1,
            IsChecked: false,
            RequestToPublic: true
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
    ProductCreateComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.productService.getListOfCategories().then(function (data) {
            _this.categories = JSON.parse(data);
        });
    };
    ProductCreateComponent.prototype.saveProductInfo = function () {
        var _this = this;
        if (this.itemImage == undefined || this.item.Title == "" || this.item.Description == "") {
            this.createNotification('error', 'warning', 'chose picture to send and populate all fields');
            return;
        }
        var formData = new FormData();
        var xmlhttp = new XMLHttpRequest();
        formData.append("Id", this.item.Id);
        formData.append("Title", this.item.Title);
        formData.append("RequestToPublic", this.item.RequestToPublic);
        formData.append("DateCreated", (new Date()).toJSON());
        formData.append("Description", this.item.Description);
        formData.append("UserId", this.item.UserId);
        formData.append("ImgUrl", this.item.ImgUrl);
        formData.append("CategoryId", this.item.CategoryId);
        if (this.itemImage != undefined) {
            formData.append("image", this.itemImage[0], this.itemImage[0].name);
        }
        else {
            formData.append("image", 0);
        }
        this.animLoaderStart();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    _this.animLoaderStop();
                    try {
                        var result = JSON.parse(xmlhttp.response);
                        if (result) {
                            _this.router.navigate(['/account/userpage']);
                        }
                        else {
                            _this.createNotification('error', 'warning', 'image size must be less than 500 kb');
                        }
                    }
                    catch (err) {
                        _this.createNotification('error', 'warning', 'image size must be less than 500 kb');
                    }
                }
                else {
                    _this.createNotification('error', 'warning', 'image size must be less than 500 kb');
                }
                _this.animLoaderStop();
                $('#itemImage').val("");
                _this.itemImage = null;
            }
        };
        xmlhttp.open('POST', '/accountaction/CreateNewProduct');
        xmlhttp.send(formData);
    };
    ProductCreateComponent.prototype.animLoaderStart = function () {
        var anime = $('.animator.remove-loader');
        if (anime != undefined) {
            anime.removeClass('remove-loader');
        }
    };
    ProductCreateComponent.prototype.animLoaderStop = function () {
        var anime = $('.animator');
        if (anime != undefined) {
            anime.addClass('remove-loader');
        }
    };
    ProductCreateComponent.prototype.createNotification = function (messageType, fromUser, messageInfo) {
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
    ProductCreateComponent.prototype.onProductImage = function (event) {
        this.itemImage = event.srcElement.files;
        var _productPreview = this.productPreview;
        var reader = new FileReader();
        reader.onload = function (e) {
            _productPreview(e.target['result']);
        };
        reader.readAsDataURL(this.itemImage[0]);
    };
    ProductCreateComponent.prototype.productPreview = function (imageUrl) {
        $('#itemImagePreview').attr('src', imageUrl);
    };
    ProductCreateComponent.prototype.ngOnDestroy = function () {
        this.conneciton.stop();
    };
    ProductCreateComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/account/components/product-create-component.html',
            animations: [router_animation_1.routerTransition()],
            host: { '[@routerTransition]': '' }
        }),
        __metadata("design:paramtypes", [router_1.Router, user_products_service_1.UserProductsService, angular2_notifications_1.NotificationsService, angular2_notifications_1.PushNotificationsService])
    ], ProductCreateComponent);
    return ProductCreateComponent;
}());
exports.ProductCreateComponent = ProductCreateComponent;
