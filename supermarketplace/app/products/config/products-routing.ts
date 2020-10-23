import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './../components/products-component';
import { ProductsListComponent } from './../components/products-list-component';
import { UserRegisterComponent } from './../authcomponent/user-component';
import { UserLoginComponent } from './../authcomponent/user-login-component';
import { MyHomePageComponent } from './../components/home-component';

const routes: Routes = [    
    {
        path: 'products', component: ProductsComponent, children: [
            { path: '', component: MyHomePageComponent },            
            { path: 'category/:id', component: ProductsListComponent },
            { path: 'register', component: UserRegisterComponent },
            { path: 'login', component: UserLoginComponent }
        ],
    }
       
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);