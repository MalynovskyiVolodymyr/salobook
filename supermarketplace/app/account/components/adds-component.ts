import { Component } from '@angular/core';
import { Addsservice } from './../services/user-adds-service';
import { routerTransition } from './../../animation/router-animation';

@Component({
    templateUrl: 'app/account/components/adds-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class AddsComponent {
    public addsItems: Array<any>;

    constructor(private addsService: Addsservice) { }

    ngAfterViewInit() {
        this.addsService.getListOfAdds().then(data => {
            this.addsItems = JSON.parse(data);
        });
    }
}