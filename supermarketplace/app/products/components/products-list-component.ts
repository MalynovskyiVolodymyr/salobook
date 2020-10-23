import { Component, Input, ComponentRef, ComponentFactory } from '@angular/core';
import { Router, NavigationStart, Event, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NotificationsService, SimpleNotificationsComponent, PushNotificationsService } from 'angular2-notifications';
import { Productservice } from './../services/product-service';
import { Addsservice } from './../services/adds-service';

import 'rxjs/add/operator/filter';
import { routerTransition } from './../../animation/router-animation';

@Component({    
    templateUrl: 'app/products/components/products-list-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class ProductsListComponent {   
    private conneciton: SignalR.Hub.Connection;
    private proxy: SignalR.Hub.Proxy; 
    private sub: any;
    private subFirstRoute: any;
    public products: Array<any> = [];
    public pageCounter: number;
    public currentCategory: number;
    public pages: Array<number> = [];
    public activePageNum: number = 1;
    public advertisingImg: Array<any>;
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

    constructor(private router: Router, private routerValue: ActivatedRoute, private productService: Productservice, private addsService: Addsservice, private _service: NotificationsService, private _push: PushNotificationsService) {            
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
        if (this.sub == undefined) {
            this.sub = this.router.events.filter(event => {
                if (event instanceof NavigationEnd && event.urlAfterRedirects.slice(0, 19).localeCompare('/products/category/') == 0) {
                    return true;
                }
                return false;
            }).subscribe((event: Event) => {
                this.currentCategory = this.routerValue.snapshot.params["id"];
                this.activePageNum = 1;

                if (this.advertisingImg == null) {
                    this.addsService.getListOfAdds().then(data => {
                        if (data != "") {
                            this.advertisingImg = JSON.parse(data);
                            this.getProducts({ page: 1, category: this.currentCategory });
                        }
                    }).catch(err => {
                        this.createNotification('error', 'warning', 'Internate connection error');
                    });
                } else {
                    this.getProducts({ page: 1, category: this.currentCategory });
                }                
            });
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

    active(pageNumber:number) {        
        this.activePageNum = pageNumber + 1;
        this.getProducts({ page: this.activePageNum, category: this.currentCategory });
    }

    ngOnDestroy() {
        this.conneciton.stop();
        if (this.sub != undefined) {
            this.sub.unsubscribe();
        }
    } 

    getProducts(category) {
        this.animLoaderStart();
        this.productService.getProductsPerPage(category)
            .then((data) => {   
                if (data != "") {
                    let responce = JSON.parse(data);
                    this.products = [];
                    this.products = responce.ProductsPerPage;
                    this.pageCounter = responce.CountOfPages;
                    this.pages = [];
                    for (let i = 0; i < this.pageCounter; ++i) {
                        this.pages.push(i);
                    }
                    if (this.pages.length == 0) {
                        this.pages.push(0);
                    }

                    this.animLoaderStop();
                } else {
                    this.createNotification('error', 'warning', 'Internate connection error');
                }
            }).catch(error => {
                this.createNotification('error', 'warning', 'Internate connection error');
                this.animLoaderStop();
            });        
    }

}