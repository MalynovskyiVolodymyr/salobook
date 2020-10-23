import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class UserProductsService {
    constructor(private http: Http) {

    }

    getListOfCategories() {
        return this.http.get('/homeaction/GetCategoriesList')
            .map(response => response.text()).toPromise();
    }

    getProductsPerPage(category) {
        return this.http.post('/homeaction/GetProducts', category)
            .map(data => data.text()).toPromise();
    }

    getAdminProductsPerPage(category) {
        return this.http.post('/adminaction/GetProducts', category)
            .map(data => data.text()).toPromise();
    }

    getAdminAllowToPublic(item) {
        return this.http.post('/adminaction/UpdateProductImage', item)
            .map(data => data.text()).toPromise();
    }

    getUserFriendProducts(pageNumber) {
        return this.http.post('/accountaction/GetUserFriendProducts', pageNumber)
            .map(response => response.text()).toPromise();
    }

    getUserProducts(pageNumber) {
        return this.http.post('/accountaction/GetUserProducts', pageNumber)
            .map(data => data.text()).toPromise();
    }

    removeProductAdm(product) {
        return this.http.post('/accountaction/RemoveProductItem', product)
            .map(response => response.text()).toPromise();
    }
    
}
