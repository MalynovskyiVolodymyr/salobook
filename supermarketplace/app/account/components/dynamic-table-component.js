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
var user_adds_service_1 = require("./../services/user-adds-service");
var user_products_service_1 = require("./../services/user-products-service");
var user_captha_service_1 = require("./../services/user-captha-service");
var user_users_service_1 = require("./../services/user-users-service");
var DynamicTableComponent = (function () {
    function DynamicTableComponent(routerValue, router, addsService, productService, capthasService, usersService) {
        this.routerValue = routerValue;
        this.router = router;
        this.addsService = addsService;
        this.productService = productService;
        this.capthasService = capthasService;
        this.usersService = usersService;
        this.tableHead = new Array();
        this.tableBody = new Array();
        this.activatedUrl = "";
        this.activatedUrl = routerValue.snapshot.url.join('');
    }
    DynamicTableComponent.prototype.ngOnChanges = function () {
        this.tableHead = [];
        this.tableBody = [];
        if (this.productsByCategory != null) {
            this.createDynamicTableHead(this.productsByCategory[0]);
            this.createDynamicTableRows(this.productsByCategory);
        }
    };
    DynamicTableComponent.prototype.createDynamicTableHead = function (item) {
        for (var i in item) {
            this.tableHead.push(i);
        }
        console.log(this.tableHead);
    };
    DynamicTableComponent.prototype.actionEdit = function (item) {
        switch (this.activatedUrl) {
            case 'userproducts': {
                sessionStorage.removeItem("tempData");
                sessionStorage.setItem("tempData", JSON.stringify(item));
                this.router.navigate(['/account/editproduct']);
                break;
            }
            case 'advertaising': {
                sessionStorage.removeItem("tempData");
                sessionStorage.setItem("tempData", JSON.stringify(item));
                this.router.navigate(['/account/editadvertising']);
                break;
            }
            case 'capthas': {
                sessionStorage.removeItem("tempData");
                sessionStorage.setItem("tempData", JSON.stringify(item));
                this.router.navigate(['/account/editcaptcha']);
                break;
            }
            case 'controlls': {
                sessionStorage.removeItem("tempData");
                sessionStorage.setItem("tempData", JSON.stringify(item));
                this.router.navigate(['/account/editcontroll']);
                break;
            }
        }
        console.log('in edit => ', item);
    };
    DynamicTableComponent.prototype.actionDelete = function (item) {
        var _this = this;
        switch (this.activatedUrl) {
            case 'userproducts': {
                item.DateCreated = new Date(item.DateCreated).toJSON();
                this.productService.removeProductAdm(item).then(function (resp) {
                    _this.removeItemFromArray(resp, item);
                });
                break;
            }
            case 'advertaising': {
                this.addsService.removeAdds(item).then(function (resp) {
                    _this.removeItemFromArray(resp, item);
                });
                break;
            }
            case 'capthas': {
                this.capthasService.removeCaptha(item).then(function (resp) {
                    _this.removeItemFromArray(resp, item);
                });
                break;
            }
            case 'allusers': {
                this.usersService.removeUser(item).then(function (resp) {
                    _this.removeItemFromArray(resp, item);
                });
                break;
            }
        }
    };
    DynamicTableComponent.prototype.allowPublicProduct = function (check, product) {
        var _this = this;
        if (!check) {
            return;
        }
        product['DateCreated'] = new Date();
        this.productService.getAdminAllowToPublic(product).then(function (response) {
            _this.productsByCategory[_this.productsByCategory.indexOf(product)]['IsChecked'] = true;
            _this.productsByCategory[_this.productsByCategory.indexOf(product)]['RequestToPublic'] = false;
        });
    };
    DynamicTableComponent.prototype.forsedAddToFriens = function (friend) {
        this.usersService.forsedAddToFriends(friend).then(function (data) {
            if (JSON.parse(data)) {
                alert("this user was added!");
            }
            else {
                alert("cannot add this user to friends!");
            }
        }).catch(function (err) {
            alert('error');
        });
    };
    DynamicTableComponent.prototype.removeItemFromArray = function (resp, item) {
        if (JSON.parse(resp)) {
            var index = this.tableBody.indexOf(item);
            if (index > -1) {
                this.tableBody.splice(index, 1);
            }
            ;
        }
        else {
            console.log('cannot remove item');
        }
    };
    DynamicTableComponent.prototype.createDynamicTableRows = function (items) {
        this.tableBody = items;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], DynamicTableComponent.prototype, "productsByCategory", void 0);
    DynamicTableComponent = __decorate([
        core_1.Component({
            selector: 'dynamic-table',
            templateUrl: 'app/account/components/dynamic-table-component.html'
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, user_adds_service_1.Addsservice, user_products_service_1.UserProductsService, user_captha_service_1.Capthasservice, user_users_service_1.UserUsersService])
    ], DynamicTableComponent);
    return DynamicTableComponent;
}());
exports.DynamicTableComponent = DynamicTableComponent;
