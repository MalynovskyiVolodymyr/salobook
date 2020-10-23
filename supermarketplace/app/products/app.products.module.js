"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var http_1 = require("@angular/http");
var products_routing_1 = require("./config/products-routing");
var product_service_1 = require("./services/product-service");
var user_service_1 = require("./services/user-service");
var adds_service_1 = require("./services/adds-service");
var products_component_1 = require("./components/products-component");
var products_list_component_1 = require("./components/products-list-component");
var adds_component_1 = require("./components/adds-component");
var product_item_component_1 = require("./components/product-item-component");
var user_component_1 = require("./authcomponent/user-component");
var user_login_component_1 = require("./authcomponent/user-login-component");
var home_component_1 = require("./components/home-component");
var angular2_notifications_1 = require("angular2-notifications");
var ProductsModule = (function () {
    function ProductsModule() {
    }
    ProductsModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, http_1.HttpModule, products_routing_1.routing, forms_1.FormsModule, forms_1.ReactiveFormsModule, angular2_notifications_1.SimpleNotificationsModule, angular2_notifications_1.PushNotificationsModule],
            declarations: [products_component_1.ProductsComponent, products_list_component_1.ProductsListComponent, adds_component_1.AddsComponent, product_item_component_1.ProductItemComponent, user_login_component_1.UserLoginComponent, user_component_1.UserRegisterComponent, home_component_1.MyHomePageComponent],
            providers: [product_service_1.Productservice, user_service_1.UserService, adds_service_1.Addsservice]
        })
    ], ProductsModule);
    return ProductsModule;
}());
exports.ProductsModule = ProductsModule;
