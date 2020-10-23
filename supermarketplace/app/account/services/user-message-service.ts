import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class UserMessagesService {
    constructor(private http: Http) {

    }

    sendMessage(message) {
        return this.http.post('/accountaction/SendUserMessage', message)
            .map(response => response.text()).toPromise();
    }    
}