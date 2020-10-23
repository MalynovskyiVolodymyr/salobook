"use strict";
var router_1 = require('@angular/router');
var routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', loadChildren: 'app/products/app.products.module#ProductsModule' },
    { path: 'account', loadChildren: 'app/account/app.account.module#AccountModule' }
];
exports.routing = router_1.RouterModule.forRoot(routes);
