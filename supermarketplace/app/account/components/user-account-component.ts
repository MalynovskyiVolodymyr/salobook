import { Component, Input } from '@angular/core';
import { UserAccountService } from './../services/user-account-service';
import { Router, NavigationStart, Event, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { UserProfileService } from './../services/user-profile-service';

class UserInfoViewModel {    
    public UserName: string;
    public UserBackgroundImage: string;
    public ImgUrl: string;   
}

@Component({
    templateUrl: 'app/account/components/user-account-component.html'
})
export class UserAccountComponent {

    private sub: any;
    public userAccountMenu: Array<any>;
    public activeControll: number = 0;
    public userData: any;
    public userInfo: UserInfoViewModel = {        
        UserName: "",
        UserBackgroundImage: "",
        ImgUrl: ""        
    };    

    constructor(private userAccountService: UserAccountService, private router: Router, private userService: UserProfileService) {
        
    }

    ngAfterViewInit() {
        this.userAccountService.getUserMenu()
            .then(data => {
                if (data != "") {
                    this.userAccountMenu = JSON.parse(data);
                    this.initUserAccountPage();
                }                
            });        
    }

    checkRoute() {       
        return this.router.url != '/account/friend';
    }

    logoutUser() {
        this.userAccountService.logout()
            .then(data => {
                localStorage.clear();
                sessionStorage.clear();
                location.replace('/');
                this.router.navigateByUrl('/products');
            })
    }

    animLoaderStart() {
        let anime = $('.animator.remove-loader');
        if (anime != undefined) {
            anime.removeClass('remove-loader');
        }
    }

    animLoaderStop() {
        let anime = $('.animator');
        if (anime != undefined) {
            anime.addClass('remove-loader');
        }
    }  

    initUserAccountPage() {
        this.animLoaderStart();
        this.userAccountService.getUserFriendsAndMessages().then(data => {
            this.animLoaderStop();
            if (data != "") {
                this.userAccountService.saveUserInfo(data);
                this.userInfo = JSON.parse(data);                
                this.router.navigateByUrl('/account/userpage');                                       
            }
        })
    }

    active(menuItem) {
        this.activeControll = menuItem.Id;
    }
}