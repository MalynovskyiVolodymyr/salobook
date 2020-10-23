import { Component, Input } from '@angular/core';
import { NotificationsService, SimpleNotificationsComponent, PushNotificationsService } from 'angular2-notifications';
import { UserAccountService } from './../services/user-account-service';
import { UserProductsService } from './../services/user-products-service';
import { UserMessagesService } from './../services/user-message-service';

interface UserInfoViewModel {
    UserId: number;
    UserEmail: string;
    DateCreated: Date;
    UserName: string;
    UserBackgroundImage: string;
    ImgUrl: string;    
    MyProducts: { ProductsPerPage: Array<any>, CountOfPages: number };   
}

@Component({
    templateUrl: 'app/account/components/user-friend-component.html'
})
export class UserFriendComponent {
    private conneciton: SignalR.Hub.Connection;
    private proxy: SignalR.Hub.Proxy;

    public userInfo: UserInfoViewModel = {
        UserId: 1,
        UserEmail: "",
        DateCreated: new Date(),
        UserName: "",
        UserBackgroundImage: "",
        ImgUrl: "",       
        MyProducts: { ProductsPerPage: [], CountOfPages: 1 },
       
    };
    public options = {
        timeOut: 3000,
        lastOnBottom: true,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: true,
        pauseOnHover: true,
        preventDuplicates: false,
        preventLastDuplicates: 'visible',
        rtl: false,
        animate: 'scale',
        position: ['right', 'top']
    };

    public userProducts: Array<any>;
    public pageCounter: number;
    public pages: Array<any>;
    public activePageNum: number = 1;

    constructor(private userAccountService: UserAccountService, private userProductsService: UserProductsService, private _service: NotificationsService, private _push: PushNotificationsService) {

        this.conneciton = $.hubConnection();

        this.proxy = this.conneciton.createHubProxy("Messanger");

        this.proxy = this.conneciton.createHubProxy("Messanger");

        this.proxy.on("friendRequest", (resp) => {
            this.createNotification('info', (JSON.parse(resp))['UserName'], 'new friend request');
        });

        this.proxy.on("removeFriendRequest", (resp) => {
            this.createNotification('error', (JSON.parse(resp))['UserName'], 'removed his friend request');
        });

        this.proxy.on("addFriend", (resp) => {
            this.createNotification('success', (JSON.parse(resp))['UserName'], 'accepted your frined request');
        });

        this.proxy.on("sendMessage", (resp) => {
            this.createNotification('info', 'new message', 'you have new message');
        });

        this.proxy.on("removeFriend", (resp) => {
            this.createNotification('error', (JSON.parse(resp))['UserName'], 'removed you from his friends');
        });

        this.conneciton.start().done(resp => {
            let message = "test";
        });
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

    createNotification(messageType, fromUser, messageInfo) {
        switch (messageType) {
            case 'success':
                let a = this._service.success(fromUser, messageInfo);
                break;
            case 'alert':
                this._service.alert(fromUser, messageInfo);
                break;
            case 'error':
                this._service.error(fromUser, messageInfo);
                break;
            case 'info':
                this._service.info(fromUser, messageInfo);
                break;
            case 'bare':
                this._service.bare(fromUser, messageInfo);
                break;
        }
    }

    ngAfterViewInit() {
        this.initUserAccountPage();
    }

    initUserAccountPage() {
        let userFriend = JSON.parse(sessionStorage.getItem("friendData"));
        userFriend['DateCreated'] = new Date(); 
        this.animLoaderStart();
        this.userAccountService.getUserFriendMenu(userFriend).then(response => {
            if (response != "") {
                this.animLoaderStop();
                this.userInfo = JSON.parse(response);
                this.mapUserInfo();
            } else {
                this.createNotification('error', 'warning', 'Internet connection error');
            }        

        }).catch(err => {
            this.createNotification('error', 'warning', 'Internet connection error');
        });       
    }

    active(pageNumber: number) {        
        this.activePageNum = pageNumber + 1;
        this.animLoaderStart();
        this.userProductsService.getUserFriendProducts({ page: this.activePageNum, category: this.userInfo.UserId }).then(response => {
            delete this.userProducts;
            delete this.userInfo.MyProducts;
            this.userInfo.MyProducts = JSON.parse(response);
            this.userProducts = this.userInfo.MyProducts.ProductsPerPage;
            this.animLoaderStop();
        }).catch(err => {
            this.createNotification('error', 'warning', 'Internet connection error');
        });
    }
    
    mapUserInfo() {
        this.userProducts = this.userInfo.MyProducts.ProductsPerPage;
        this.pageCounter = this.userInfo.MyProducts.CountOfPages;
        this.pages = [];
        for (let i = 0; i < this.pageCounter; ++i) {
            this.pages.push(i);
        }
        if (this.pages.length == 0) {
            this.pages.push(0);
        }
    }

    ngOnDestroy() {
        this.conneciton.stop();
    }
}