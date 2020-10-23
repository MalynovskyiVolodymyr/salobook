import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAccountComponent } from './../components/user-account-component';
import { UserManageProducts } from './../components/user-products-component';
import { UserEditComponent } from './../components/user-product-edit-component';
import { AddsComponent } from './../components/adds-component';
import { AddsEditComponent } from './../components/adds-edit-component';
import { AddsNewComponent } from './../components/adds-create-component';
import { ProductCreateComponent } from './../components/product-create-component';
import { CapthasComponent } from './../components/capthas-component';
import { CapthasNewComponent } from './../components/capthas-create-component';
import { CapthasEditComponent } from './../components/capthas-edit-component';
import { UserPageComponent } from './../components/user-page-component';
import { UserFriendsComponent } from './../components/user-friends-component';
import { UserFriendComponent } from './../components/user-friend-component';
import { UserProfileComponent } from './../components/user-profile-component';
import { UserManageUsers } from './../components/user-users-component';
import { UserManageControlls } from './../components/user-controlls-component';
import { UserEditControllComponent } from './../components/user-controlls-edit-component';

const routes: Routes = [  
    {
        path: 'account', component: UserAccountComponent
        , children: [           
            { path: 'userpage', component: UserPageComponent },        
            { path: 'userproducts', component: UserManageProducts },
            { path: 'allusers', component: UserManageUsers },
            { path: 'controlls', component: UserManageControlls },
            { path: 'editcontroll', component: UserEditControllComponent },
            { path: 'createnewproduct', component: ProductCreateComponent },
            { path: 'friends', component: UserFriendsComponent },
            { path: 'friend', component: UserFriendComponent },
            { path: 'userprofile', component: UserProfileComponent },
            { path: 'editproduct', component: UserEditComponent },
            { path: 'advertaising', component: AddsComponent },
            { path: 'createadvertising', component: AddsNewComponent },
            { path: 'editadvertising', component: AddsEditComponent },
            { path: 'capthas', component: CapthasComponent },
            { path: 'createcaptha', component: CapthasNewComponent },
            { path: 'editcaptcha', component: CapthasEditComponent }
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);