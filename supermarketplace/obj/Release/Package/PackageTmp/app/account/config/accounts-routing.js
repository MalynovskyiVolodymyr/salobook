"use strict";
var router_1 = require('@angular/router');
var user_account_component_1 = require('./../components/user-account-component');
var user_products_component_1 = require('./../components/user-products-component');
var user_product_edit_component_1 = require('./../components/user-product-edit-component');
var adds_component_1 = require('./../components/adds-component');
var adds_edit_component_1 = require('./../components/adds-edit-component');
var adds_create_component_1 = require('./../components/adds-create-component');
var product_create_component_1 = require('./../components/product-create-component');
var capthas_component_1 = require('./../components/capthas-component');
var capthas_create_component_1 = require('./../components/capthas-create-component');
var capthas_edit_component_1 = require('./../components/capthas-edit-component');
var user_page_component_1 = require('./../components/user-page-component');
var user_friends_component_1 = require('./../components/user-friends-component');
var user_friend_component_1 = require('./../components/user-friend-component');
var user_profile_component_1 = require('./../components/user-profile-component');
var user_users_component_1 = require('./../components/user-users-component');
var user_controlls_component_1 = require('./../components/user-controlls-component');
var user_controlls_edit_component_1 = require('./../components/user-controlls-edit-component');
var routes = [
    {
        path: 'account', component: user_account_component_1.UserAccountComponent,
        children: [
            { path: 'userpage', component: user_page_component_1.UserPageComponent },
            { path: 'userproducts', component: user_products_component_1.UserManageProducts },
            { path: 'allusers', component: user_users_component_1.UserManageUsers },
            { path: 'controlls', component: user_controlls_component_1.UserManageControlls },
            { path: 'editcontroll', component: user_controlls_edit_component_1.UserEditControllComponent },
            { path: 'createnewproduct', component: product_create_component_1.ProductCreateComponent },
            { path: 'friends', component: user_friends_component_1.UserFriendsComponent },
            { path: 'friend', component: user_friend_component_1.UserFriendComponent },
            { path: 'userprofile', component: user_profile_component_1.UserProfileComponent },
            { path: 'editproduct', component: user_product_edit_component_1.UserEditComponent },
            { path: 'advertaising', component: adds_component_1.AddsComponent },
            { path: 'createadvertising', component: adds_create_component_1.AddsNewComponent },
            { path: 'editadvertising', component: adds_edit_component_1.AddsEditComponent },
            { path: 'capthas', component: capthas_component_1.CapthasComponent },
            { path: 'createcaptha', component: capthas_create_component_1.CapthasNewComponent },
            { path: 'editcaptcha', component: capthas_edit_component_1.CapthasEditComponent }
        ]
    }
];
exports.routing = router_1.RouterModule.forChild(routes);
