import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppComponent } from './components/common-component';
import { ProductsModule } from './products/app.products.module';
import { AccountModule } from './account/app.account.module';
//import { UserService } from './account/services/user-service';

import { routing } from './config/root-routing';

@NgModule({
    imports: [BrowserModule, routing, FormsModule, ReactiveFormsModule, HttpModule, ProductsModule, AccountModule],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CookieService],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {    
}
