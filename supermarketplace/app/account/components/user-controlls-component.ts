import { Component } from '@angular/core';
import { UserUsersService } from './../services/user-users-service';
import { routerTransition } from './../../animation/router-animation';

@Component({
    templateUrl: 'app/account/components/user-controlls-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class UserManageControlls {
    public controlls: Array<any>;
    constructor(private usersService: UserUsersService) { }

    ngAfterViewInit() {
        this.usersService.getAllUserControlls().then(data => {
            if (data != "") {
                this.controlls = JSON.parse(data);
            } else {
                console.log('cannot get controlls');
            }            
        })
    }
}