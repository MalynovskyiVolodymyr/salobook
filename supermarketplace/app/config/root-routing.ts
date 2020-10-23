import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsListComponent } from './../products/components/products-list-component';

const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', loadChildren: 'app/products/app.products.module#ProductsModule' },    
    { path: 'account', loadChildren: 'app/account/app.account.module#AccountModule'}
    //{ path: 'signup', component: UserCompoennt }
];
//{ path: '', redirectTo: 'products', pathMatch: 'full' },
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);