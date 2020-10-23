import { Component } from '@angular/core';
import { UserUsersService } from './../services/user-users-service';
import { routerTransition } from './../../animation/router-animation';
@Component({
    templateUrl: "app/account/components/user-users-component.html",
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class UserManageUsers {
    private sub: any;
    private subFirstRoute: any;
    public users: Array<any> = [];   
    public pageCounter: number;    
    public pages: Array<number> = [];
    public activePageNum: number = 1;

    constructor(private usersService: UserUsersService) { }

    ngAfterViewInit() {
        this.getUsers();
    }   

    activePager(pageNumber: number) {
        this.activePageNum = pageNumber + 1;
        this.getUsers();
    }

    getUsers() {
        this.usersService.getAllUsers(this.activePageNum)
            .then(data => {
                let responce = JSON.parse(data);
                this.users = [];
                this.users = responce.UsersPerPage;
                this.pageCounter = responce.CountOfPages;
                this.pages = [];
                for (let i = 0; i < this.pageCounter; ++i) {
                    this.pages.push(i);
                }
                if (this.pages.length == 0) {
                    this.pages.push(0);
                }
                console.log(this.pageCounter);
                console.log(this.pages);               
            }).catch(error => {
                console.log('in user-prod-com => ', error);
            });
    }
}