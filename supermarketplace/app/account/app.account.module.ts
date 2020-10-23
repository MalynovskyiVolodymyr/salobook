import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';

import { routing } from './config/accounts-routing';
import { UserAccountComponent } from './components/user-account-component';
import { UserManageProducts } from './components/user-products-component';
import { UserAccountService } from './services/user-account-service';
import { UserProductsService } from './services/user-products-service';
import { Addsservice } from './services/user-adds-service';
import { DynamicTableComponent } from './components/dynamic-table-component';
import { DataFormater } from './pipes/data-formater-pipe';
import { UserEditComponent } from './components/user-product-edit-component';
import { AddsComponent } from './components/adds-component';
import { AddsEditComponent } from './components/adds-edit-component';
import { AddsNewComponent } from './components/adds-create-component';
import { ProductCreateComponent } from './components/product-create-component';
import { CapthasComponent } from './components/capthas-component';
import { Capthasservice } from './services/user-captha-service';
import { CapthasNewComponent } from './components/capthas-create-component';
import { CapthasEditComponent } from './components/capthas-edit-component';
import { UserProfileService } from './services/user-profile-service';
import { UserMessagesService } from './services/user-message-service';
import { UserUsersService } from './services/user-users-service';
import { UserPageComponent } from './components/user-page-component';
import { UserFriendsComponent } from './components/user-friends-component';
import { UserFriendComponent } from './components/user-friend-component';
import { UserProfileComponent } from './components/user-profile-component';
import { UserManageUsers } from './components/user-users-component';
import { UserManageControlls } from './components/user-controlls-component';
import { UserEditControllComponent } from './components/user-controlls-edit-component';

@NgModule({
    imports: [CommonModule, HttpModule, FormsModule, ReactiveFormsModule, routing, SimpleNotificationsModule, PushNotificationsModule],
    declarations: [UserManageProducts, UserAccountComponent, UserManageUsers, UserEditControllComponent, UserManageControlls, DynamicTableComponent, DataFormater, UserEditComponent, AddsComponent, AddsEditComponent, AddsNewComponent, ProductCreateComponent, CapthasComponent, CapthasNewComponent, CapthasEditComponent, UserPageComponent, UserFriendsComponent, UserFriendComponent, UserProfileComponent],
    providers: [UserProductsService, UserUsersService, UserAccountService, UserMessagesService, Addsservice, Capthasservice, UserProfileService]
})
export class AccountModule { }