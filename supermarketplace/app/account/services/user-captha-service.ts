import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class Capthasservice {
    constructor(private http: Http) {

    }

    getListOfCapthas() {
        return this.http.get('/adminaction/GetAllCapthas')
            .map(response => response.text()).toPromise();
    }

    updateCapthaInfo(captha) {
        return this.http.post('/adminaction/EditCaptha', captha)
            .map(response => response.text()).toPromise();
    }

    removeCaptha(captha) {
        return this.http.post('/adminaction/RemoveCaptha', captha)
            .map(response => response.text()).toPromise();
    }
}
