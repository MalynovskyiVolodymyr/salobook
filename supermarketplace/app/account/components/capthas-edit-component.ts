import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Capthasservice } from './../services/user-captha-service';
import { routerTransition } from './../../animation/router-animation';

@Component({
    templateUrl: 'app/account/components/capthas-edit-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class CapthasEditComponent {
    public itemToEdit: any = null; 
 
    constructor(private router: Router, private capthaService: Capthasservice) {
        this.itemToEdit = JSON.parse(sessionStorage.getItem('tempData'));
        sessionStorage.removeItem('tempData');
    }

    updateCapthaInfo() {
        this.capthaService.updateCapthaInfo(this.itemToEdit).then(data => {
            this.itemToEdit = JSON.parse(data);
        });
    }   
}