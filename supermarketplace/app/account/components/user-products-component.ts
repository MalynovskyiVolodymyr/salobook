import { Component } from '@angular/core';
import { UserProductsService } from './../services/user-products-service';
import { routerTransition } from './../../animation/router-animation';
@Component({
    templateUrl: "app/account/components/user-products-component.html",
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class UserManageProducts {
    private sub: any;
    private subFirstRoute: any;
    public products: Array<any> = [];
    public categories: Array<any> = [];
    public pageCounter: number;
    public currentCategory: number;
    public pages: Array<number> = [];
    public activePageNum: number = 1;      

    constructor(private productsService: UserProductsService) { }

    ngAfterViewInit() {
        this.getCategories();
    }

    active(category) {
        this.currentCategory = category.Id;    
        this.getProducts({ page: 1, category: this.currentCategory });
        this.activePageNum = 1;          
    }

    activePager(pageNumber: number) {        
        this.activePageNum = pageNumber + 1;
        this.getProducts({ page: pageNumber + 1, category: this.currentCategory });
    }

    getCategories() {
        this.productsService.getListOfCategories()
            .then(data => {
                this.categories = JSON.parse(data);
                this.currentCategory = this.categories[0].Id;
                this.getProducts({ page: 1, category: this.currentCategory });
            }).catch(error => {
                console.log('in user-prod-com => ', error);
            });
    }

    getProducts(category) {
        //this.animationStart();
        this.productsService.getAdminProductsPerPage(category)
            .then((data) => {
                let responce = JSON.parse(data);
                this.products = [];
                this.products = responce.ProductsPerPage;
                this.pageCounter = responce.CountOfPages;
                this.pages = [];
                for (let i = 0; i < this.pageCounter; ++i) {
                    this.pages.push(i);
                }
                if (this.pages.length == 0) {
                    this.pages.push(0);
                }
                console.log(this.pageCounter);
                console.log(this.pages);
                //this.animationStop();

            }).catch(error => {
                console.log('in user-prod-com => ', error);
            });
    }

    
}