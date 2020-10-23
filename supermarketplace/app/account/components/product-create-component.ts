import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService, SimpleNotificationsComponent, PushNotificationsService } from 'angular2-notifications';
import { UserProductsService } from './../services/user-products-service';
import { routerTransition } from './../../animation/router-animation';

interface ProductModel {    
    Id: number;
    Title: string;
    DateCreated: Date;
    Description: any;
    UserId: number;
    ImgUrl: string;
    CategoryId: number;
    IsChecked: boolean;
    RequestToPublic: boolean;
}

@Component({
    templateUrl: 'app/account/components/product-create-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class ProductCreateComponent {
    private conneciton: SignalR.Hub.Connection;
    private proxy: SignalR.Hub.Proxy;
    public item: ProductModel = {
        Id:1,
        Title: "",
        DateCreated:null,
        Description: "",
        UserId: 1,
        ImgUrl: "",
        CategoryId: 1,
        IsChecked: false,
        RequestToPublic:true
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
    public itemImage: any;
    public categories: Array<any>;   

    constructor(private router: Router, private productService: UserProductsService, private _service: NotificationsService, private _push: PushNotificationsService) {
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
        this.productService.getListOfCategories().then(data => {
            this.categories = JSON.parse(data);
        })
    }
    
    saveProductInfo() {
        if (this.itemImage == undefined || this.item.Title == "" || this.item.Description == "") {
            this.createNotification('error', 'warning', 'chose picture to send and populate all fields');
            return;
        }
        var formData: FormData = new FormData();
        var xmlhttp: XMLHttpRequest = new XMLHttpRequest();

        formData.append("Id", this.item.Id);

        formData.append("Title", this.item.Title);

        formData.append("RequestToPublic", this.item.RequestToPublic);

        formData.append("DateCreated", (new Date()).toJSON());

        formData.append("Description", this.item.Description);

        formData.append("UserId", this.item.UserId);

        formData.append("ImgUrl", this.item.ImgUrl);

        formData.append("CategoryId", this.item.CategoryId);

        if (this.itemImage != undefined) {
            formData.append("image", this.itemImage[0], this.itemImage[0].name);
        } else {
            formData.append("image", 0);
        }
        this.animLoaderStart();
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {  
                    this.animLoaderStop();    
                    try {
                        let result = JSON.parse(xmlhttp.response);
                        if (result) {
                            this.router.navigate(['/account/userpage']);
                        } else {
                            this.createNotification('error', 'warning', 'image size must be less than 500 kb'); 
                        }
                    } catch (err) {
                        this.createNotification('error', 'warning', 'image size must be less than 500 kb'); 
                    }             
                    
                } else {                    
                    this.createNotification('error', 'warning', 'image size must be less than 500 kb');                    
                }
                this.animLoaderStop();
                $('#itemImage').val("");                
                this.itemImage = null;               
            }
        };
      
        xmlhttp.open('POST', '/accountaction/CreateNewProduct');
        xmlhttp.send(formData);
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

    onProductImage(event) {
        this.itemImage = event.srcElement.files;
        var _productPreview = this.productPreview;        
        var reader = new FileReader();
        reader.onload = function (e) {
            _productPreview(e.target['result']);            
        }
        reader.readAsDataURL(this.itemImage[0]);    
    }

    productPreview(imageUrl: any) {        
        $('#itemImagePreview').attr('src', imageUrl);
    }

    ngOnDestroy() {
        this.conneciton.stop();
    }
}

