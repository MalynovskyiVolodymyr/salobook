import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class Addsservice {
    constructor(private http: Http) {

    }

    getListOfAdds() {
        return this.http.get('/homeaction/GetAddsList')
            .map(response => response.text()).toPromise();
    }
    

}
