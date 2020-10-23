import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { routing } from './config/products-routing';
import { Productservice } from './services/product-service';
import { UserService } from './services/user-service';
import { Addsservice } from './services/adds-service';
import { ProductsComponent } from './components/products-component';
import { ProductsListComponent } from './components/products-list-component';
import { AddsComponent } from './components/adds-component';
import { ProductItemComponent } from './components/product-item-component';
import { UserRegisterComponent } from './authcomponent/user-component';
import { UserLoginComponent } from './authcomponent/user-login-component';
import { MyHomePageComponent } from './components/home-component';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';


@NgModule({
    imports: [CommonModule, HttpModule, routing, FormsModule, ReactiveFormsModule, SimpleNotificationsModule, PushNotificationsModule],
    declarations: [ProductsComponent, ProductsListComponent, AddsComponent, ProductItemComponent, UserLoginComponent, UserRegisterComponent, MyHomePageComponent],
    providers: [Productservice, UserService, Addsservice]
})
export class ProductsModule {}