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
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var cookies_service_1 = require('angular2-cookie/services/cookies.service');
var common_component_1 = require('./components/common-component');
var app_products_module_1 = require('./products/app.products.module');
var app_account_module_1 = require('./account/app.account.module');
var root_routing_1 = require('./config/root-routing');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, root_routing_1.routing, forms_1.FormsModule, forms_1.ReactiveFormsModule, http_1.HttpModule, app_products_module_1.ProductsModule, app_account_module_1.AccountModule],
            providers: [{ provide: common_1.APP_BASE_HREF, useValue: '/' }, cookies_service_1.CookieService],
            declarations: [common_component_1.AppComponent],
            bootstrap: [common_component_1.AppComponent],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
