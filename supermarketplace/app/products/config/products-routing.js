"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var products_component_1 = require("./../components/products-component");
var products_list_component_1 = require("./../components/products-list-component");
var user_component_1 = require("./../authcomponent/user-component");
var user_login_component_1 = require("./../authcomponent/user-login-component");
var home_component_1 = require("./../components/home-component");
var routes = [
    {
        path: 'products', component: products_component_1.ProductsComponent, children: [
            { path: '', component: home_component_1.MyHomePageComponent },
            { path: 'category/:id', component: products_list_component_1.ProductsListComponent },
            { path: 'register', component: user_component_1.UserRegisterComponent },
            { path: 'login', component: user_login_component_1.UserLoginComponent }
        ],
    }
];
exports.routing = router_1.RouterModule.forChild(routes);
