import { Component } from '@angular/core';
import { Capthasservice } from './../services/user-captha-service';
import { routerTransition } from './../../animation/router-animation';

@Component({
    templateUrl: 'app/account/components/capthas-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class CapthasComponent {
    public capthas: Array<any>;
    constructor(private capthaService: Capthasservice) { }

    ngAfterViewInit() {
        this.capthaService.getListOfCapthas().then(data => {
            this.capthas = JSON.parse(data);
        })
    }
}