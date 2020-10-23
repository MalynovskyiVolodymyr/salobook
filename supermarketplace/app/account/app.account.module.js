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
var angular2_notifications_1 = require("angular2-notifications");
var accounts_routing_1 = require("./config/accounts-routing");
var user_account_component_1 = require("./components/user-account-component");
var user_products_component_1 = require("./components/user-products-component");
var user_account_service_1 = require("./services/user-account-service");
var user_products_service_1 = require("./services/user-products-service");
var user_adds_service_1 = require("./services/user-adds-service");
var dynamic_table_component_1 = require("./components/dynamic-table-component");
var data_formater_pipe_1 = require("./pipes/data-formater-pipe");
var user_product_edit_component_1 = require("./components/user-product-edit-component");
var adds_component_1 = require("./components/adds-component");
var adds_edit_component_1 = require("./components/adds-edit-component");
var adds_create_component_1 = require("./components/adds-create-component");
var product_create_component_1 = require("./components/product-create-component");
var capthas_component_1 = require("./components/capthas-component");
var user_captha_service_1 = require("./services/user-captha-service");
var capthas_create_component_1 = require("./components/capthas-create-component");
var capthas_edit_component_1 = require("./components/capthas-edit-component");
var user_profile_service_1 = require("./services/user-profile-service");
var user_message_service_1 = require("./services/user-message-service");
var user_users_service_1 = require("./services/user-users-service");
var user_page_component_1 = require("./components/user-page-component");
var user_friends_component_1 = require("./components/user-friends-component");
var user_friend_component_1 = require("./components/user-friend-component");
var user_profile_component_1 = require("./components/user-profile-component");
var user_users_component_1 = require("./components/user-users-component");
var user_controlls_component_1 = require("./components/user-controlls-component");
var user_controlls_edit_component_1 = require("./components/user-controlls-edit-component");
var AccountModule = (function () {
    function AccountModule() {
    }
    AccountModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, http_1.HttpModule, forms_1.FormsModule, forms_1.ReactiveFormsModule, accounts_routing_1.routing, angular2_notifications_1.SimpleNotificationsModule, angular2_notifications_1.PushNotificationsModule],
            declarations: [user_products_component_1.UserManageProducts, user_account_component_1.UserAccountComponent, user_users_component_1.UserManageUsers, user_controlls_edit_component_1.UserEditControllComponent, user_controlls_component_1.UserManageControlls, dynamic_table_component_1.DynamicTableComponent, data_formater_pipe_1.DataFormater, user_product_edit_component_1.UserEditComponent, adds_component_1.AddsComponent, adds_edit_component_1.AddsEditComponent, adds_create_component_1.AddsNewComponent, product_create_component_1.ProductCreateComponent, capthas_component_1.CapthasComponent, capthas_create_component_1.CapthasNewComponent, capthas_edit_component_1.CapthasEditComponent, user_page_component_1.UserPageComponent, user_friends_component_1.UserFriendsComponent, user_friend_component_1.UserFriendComponent, user_profile_component_1.UserProfileComponent],
            providers: [user_products_service_1.UserProductsService, user_users_service_1.UserUsersService, user_account_service_1.UserAccountService, user_message_service_1.UserMessagesService, user_adds_service_1.Addsservice, user_captha_service_1.Capthasservice, user_profile_service_1.UserProfileService]
        })
    ], AccountModule);
    return AccountModule;
}());
exports.AccountModule = AccountModule;
