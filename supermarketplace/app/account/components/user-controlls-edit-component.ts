import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserUsersService } from './../services/user-users-service';
import { routerTransition } from './../../animation/router-animation';

@Component({
    templateUrl: 'app/account/components/user-controlls-edit-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class UserEditControllComponent {
    public itemToEdit: any = null;
    public categories: Array<any> = [];
    files: any;
    constructor(private router: Router, private usersService: UserUsersService) {
        this.itemToEdit = JSON.parse(sessionStorage.getItem('tempData'));
        sessionStorage.removeItem('tempData');
    }

    updateUserControll() {
        this.usersService.updateUserControll(this.itemToEdit).then(data => {
            if (data != null) {
                this.router.navigate(['/account/controlls']);
            }
        });
    }
}