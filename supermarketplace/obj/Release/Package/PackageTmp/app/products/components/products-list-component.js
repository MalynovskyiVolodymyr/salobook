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
var angular2_notifications_1 = require('angular2-notifications');
var product_service_1 = require('./../services/product-service');
var adds_service_1 = require('./../services/adds-service');
require('rxjs/add/operator/filter');
var router_animation_1 = require('./../../animation/router-animation');
var ProductsListComponent = (function () {
    function ProductsListComponent(router, routerValue, productService, addsService, _service, _push) {
        var _this = this;
        this.router = router;
        this.routerValue = routerValue;
        this.productService = productService;
        this.addsService = addsService;
        this._service = _service;
        this._push = _push;
        this.products = [];
        this.pages = [];
        this.activePageNum = 1;
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
    ProductsListComponent.prototype.createNotification = function (messageType, fromUser, messageInfo) {
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
    ProductsListComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.sub == undefined) {
            this.sub = this.router.events.filter(function (event) {
                if (event instanceof router_1.NavigationEnd && event.urlAfterRedirects.slice(0, 19).localeCompare('/products/category/') == 0) {
                    return true;
                }
                return false;
            }).subscribe(function (event) {
                _this.currentCategory = _this.routerValue.snapshot.params["id"];
                _this.activePageNum = 1;
                if (_this.advertisingImg == null) {
                    _this.addsService.getListOfAdds().then(function (data) {
                        if (data != "") {
                            _this.advertisingImg = JSON.parse(data);
                            _this.getProducts({ page: 1, category: _this.currentCategory });
                        }
                    }).catch(function (err) {
                        _this.createNotification('error', 'warning', 'Internate connection error');
                    });
                }
                else {
                    _this.getProducts({ page: 1, category: _this.currentCategory });
                }
            });
        }
    };
    ProductsListComponent.prototype.animLoaderStart = function () {
        var anime = $('.animator.remove-loader');
        if (anime != undefined) {
            anime.removeClass('remove-loader');
        }
    };
    ProductsListComponent.prototype.animLoaderStop = function () {
        var anime = $('.animator');
        if (anime != undefined) {
            anime.addClass('remove-loader');
        }
    };
    ProductsListComponent.prototype.active = function (pageNumber) {
        this.activePageNum = pageNumber + 1;
        this.getProducts({ page: this.activePageNum, category: this.currentCategory });
    };
    ProductsListComponent.prototype.ngOnDestroy = function () {
        this.conneciton.stop();
        if (this.sub != undefined) {
            this.sub.unsubscribe();
        }
    };
    ProductsListComponent.prototype.getProducts = function (category) {
        var _this = this;
        this.animLoaderStart();
        this.productService.getProductsPerPage(category)
            .then(function (data) {
            if (data != "") {
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
                _this.animLoaderStop();
            }
            else {
                _this.createNotification('error', 'warning', 'Internate connection error');
            }
        }).catch(function (error) {
            _this.createNotification('error', 'warning', 'Internate connection error');
            _this.animLoaderStop();
        });
    };
    ProductsListComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/products/components/products-list-component.html',
            animations: [router_animation_1.routerTransition()],
            host: { '[@routerTransition]': '' }
        }), 
        __metadata('design:paramtypes', [router_1.Router, router_1.ActivatedRoute, product_service_1.Productservice, adds_service_1.Addsservice, angular2_notifications_1.NotificationsService, angular2_notifications_1.PushNotificationsService])
    ], ProductsListComponent);
    return ProductsListComponent;
}());
exports.ProductsListComponent = ProductsListComponent;
