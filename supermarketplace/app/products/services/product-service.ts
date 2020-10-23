import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class Productservice {
    constructor(private http: Http) {

    }

    getListOfCategories(){             
        return this.http.get('/homeaction/GetCategoriesList')
            .map(response => response.text()).toPromise();            
    }

    getProductsPerPage(category) {
        return this.http.post('/homeaction/GetProducts', category)
            .map(data => data.text()).toPromise();            
    }
}
