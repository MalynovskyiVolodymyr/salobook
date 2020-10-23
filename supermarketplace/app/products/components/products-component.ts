import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NotificationsService, SimpleNotificationsComponent, PushNotificationsService } from 'angular2-notifications';
import { Productservice } from './../services/product-service';
import { UserService } from './../services/user-service';


@Component({
    templateUrl: 'app/products/components/products-component.html'    
})
export class ProductsComponent {
    private conneciton: SignalR.Hub.Connection;
    private proxy: SignalR.Hub.Proxy;

    public categories: Array<any> = [];
    public activeControll: number = 0;
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

    constructor(private productService: Productservice, private userService: UserService, private _service: NotificationsService, private _push: PushNotificationsService) {
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

    ngAfterViewInit() {
        this.animLoaderStart();
        this.productService.getListOfCategories()
            .then(data => {
                this.animLoaderStop();
                this.categories = JSON.parse(data);
            }).catch(err => {
                this.animLoaderStop();
                this.createNotification('error', 'warning', 'Internet connection error');
            });
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

    active(menuItem) {
        this.activeControll = menuItem.Id;
    }

    checkIfLoggedIn() {
        return this.userService.checkIfAuthorize();
    }

    ngOnDestroy() {
        this.conneciton.stop();
    }
}