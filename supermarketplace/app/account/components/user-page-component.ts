import { Component, Input } from '@angular/core';
import { UserAccountService } from './../services/user-account-service';
import { UserProductsService } from './../services/user-products-service';
import { UserMessagesService } from './../services/user-message-service';
import { NotificationsService, SimpleNotificationsComponent, PushNotificationsService } from 'angular2-notifications';
import { routerTransition } from './../../animation/router-animation';

interface UserInfoViewModel {
    UserId: number;
    UserEmail: string;
    DateCreated: Date;
    UserName: string;
    UserBackgroundImage: string;
    ImgUrl: string;
    FriendRequests: Array<any>;
    Friends: Array<any>;
    MyFriendsRequests: Array<any>;
    MyProducts: { ProductsPerPage: Array<any>, CountOfPages: number };
    Messages: Array<any>;
}

interface UserFriendModel {
    UserId: number,
    UserEmail: string,
    UserName: string,
    ImgUrl: string,
    userMessages: Array<any>
}

interface MessageModel {
    Id:number,
    AuthorId:number,
    UserSenderId: number,
    UserResiverId: number,
    MessageText:string,
    DateCreated:Date
}

interface UserInputModel {
    text: string
} 

@Component({
    templateUrl: 'app/account/components/user-page-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }   
})
export class UserPageComponent{   
    private conneciton: SignalR.Hub.Connection;
    private proxy: SignalR.Hub.Proxy; 

    public userInfo: UserInfoViewModel = {
        UserId: 1,
        UserEmail: "",
        DateCreated: new Date(),
        UserName: "",
        UserBackgroundImage: "",
        ImgUrl: "",
        FriendRequests: [],
        Friends: [],
        MyFriendsRequests: [],
        MyProducts: { ProductsPerPage: [], CountOfPages:1},
        Messages: []
    };
    public modalDialogData: UserFriendModel = {
        UserId: 1,  
        UserEmail: "",       
        UserName: "" ,        
        ImgUrl: "",
        userMessages: []
    };
    public userInput: UserInputModel = {
        text: ""
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
    public userMessages: Array<MessageModel>;
    public userFriends: Array<any>;
    public userFriendsReuests: Array<any>;
    public requestsToUser: Array<any>;
    public tempFriends: Array<any>;
    public pageCounter: number;
    public pages: Array<any>;
    public activePageNum: number = 1;
    public modalDialogIndicator = false;

    constructor(private userAccountService: UserAccountService, private userProductsService: UserProductsService, private userMessageService: UserMessagesService, private _service: NotificationsService, private _push: PushNotificationsService) {

        this.conneciton = $.hubConnection();

        this.proxy = this.conneciton.createHubProxy("Messanger");

        this.proxy.on("sendMessage", (resp) => {           
            this.reciveMessage(resp);            
        });

        this.proxy.on("friendRequest", (resp) => {
            let tempUser = JSON.parse(resp);
            this.createNotification('info', tempUser['UserName'], 'new friend request');
        });

        this.proxy.on("removeFriendRequest", (resp) => {
            let tempUser = JSON.parse(resp);
            this.createNotification('info', tempUser['UserName'], 'removed his friend request');
        });

        this.proxy.on("addFriend", (resp) => {          
            let tempUser = JSON.parse(resp);
            this.createNotification('success', tempUser['UserName'], 'accepted your friend request');
            this.userFriends.unshift(tempUser);
            this.userAccountService.saveUserFriends(JSON.stringify(this.userFriends));
        });

        this.proxy.on("removeFriend", (resp) => {      
            let tempUser = JSON.parse(resp);
            this.createNotification('alert', tempUser['UserName'],'has removed you from his friends');
            this.excludeUnnesessaryUser(tempUser, this.userFriends);            
            this.userAccountService.saveUserFriends(JSON.stringify(this.userFriends));
        });

        this.conneciton.start().done(resp => {
            let message = "test";

        });
        
    }
        
    createNotification(messageType, fromUser ,messageInfo) {        
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

    ngAfterViewInit() {
        this.initUserAccountPage();
    }

    initUserAccountPage() {
        let tempData = this.userAccountService.getUserInfo();
        if (tempData != undefined) {
            this.userInfo = JSON.parse(this.userAccountService.getUserInfo());
            sessionStorage.removeItem("userInfo");            
            this.mapUserInfo();
        } else {
            this.animLoaderStart();
            this.userAccountService.getUserFriendsAndMessages().then(response => {
                delete this.userInfo;
                this.animLoaderStop();
                this.userInfo = JSON.parse(response);
                this.mapUserInfo();
            }).catch(err => {
                this.createNotification('error','warning', 'Internet connection error');
            });
        }                 
    }

    active(pageNumber: number) {        
        this.activePageNum = pageNumber + 1;
        this.animLoaderStart();
        this.userProductsService.getUserProducts({ page: this.activePageNum, category: 0 }).then(response => {
            delete this.userProducts;
            delete this.userInfo.MyProducts;
            this.userInfo.MyProducts = JSON.parse(response);
            this.userProducts = this.userInfo.MyProducts.ProductsPerPage;
            this.animLoaderStop();
        }).catch(err => {
            this.createNotification('error', 'warning', 'Internet connection error');
        });
    }

    removeProductItem(item) {
        item["DateCreated"] = new Date();
        this.userProductsService.removeProductAdm(item).then(resp => {
            if (resp != "" && JSON.parse(resp)) {
                for (let i = 0; i, this.userProducts.length; i++) {
                    if (this.userProducts[i]["Id"] == item["Id"]) {
                        this.removeItemFromArray(i, this.userProducts);
                    }
                }
                
            } else {
                console.log('cannot remove item');
            }
        }).catch(err => {
            this.createNotification('error', 'warning', 'Internet connection error');
        });
    }

    excludeUnnesessaryUser(userToRemove: UserInfoViewModel, actionArray: Array<UserInfoViewModel>) {
        for (let i = 0; i < actionArray.length; i++) {
            if (this.customIndexOf(userToRemove, actionArray)) {
                this.removeItemFromArray(i, actionArray);
            }
        }
    }

    customIndexOf(itemToFind: UserInfoViewModel, arrayToSearch: Array<UserInfoViewModel>) {
        for (let i = 0; i < arrayToSearch.length; i++) {
            if (itemToFind.UserEmail == arrayToSearch[i].UserEmail) {
                return true;
            }
        }
        return false;
    }

    removeItemFromArray(index: any, items: Array<any>) {
        items.splice(index, 1);
    }
      
    mapUserInfo() {
        this.userProducts = this.userInfo.MyProducts.ProductsPerPage;
        this.userFriends = this.userInfo.Friends;
        this.userAccountService.saveUserFriends(JSON.stringify(this.userFriends));
        this.userFriendsReuests = this.userInfo.MyFriendsRequests;
        this.userMessages = this.userInfo.Messages;
        this.requestsToUser = this.userInfo.FriendRequests;
        this.pageCounter = this.userInfo.MyProducts.CountOfPages;
        this.pages = [];
        for (let i = 0; i < this.pageCounter; ++i) {
            this.pages.push(i);
        }
        if (this.pages.length == 0) {
            this.pages.push(0);
        }
    }

    reciveMessage(message) {
        let tempMessage = JSON.parse(message); 
        if (this.modalDialogIndicator && this.modalDialogData.UserId == tempMessage['UserSenderId'] && this.userInfo.UserId == tempMessage['UserResiverId']) {
            this.modalDialogData.userMessages.push(tempMessage);
            let self = this;
            setTimeout(() => {
                self.autoScroller();
            }, 700);
        } else {
            this.userMessages.push(tempMessage);
            for (let i = 0; i < this.userFriends.length; i++) {
                if (this.userFriends[i]['UserId'] == tempMessage['UserSenderId']) {
                    this.createNotification('info', this.userFriends[i]['UserName'], 'new message');
                }
            }            
        }
    }

    showModalDialog(user: UserFriendModel) {  
        this.modalDialogIndicator = true;
        this.modalDialogData = user;
        this.modalDialogData.userMessages = new Array();        
        for (let i = 0; i < this.userMessages.length; i++) {
            if (this.userMessages[i].UserResiverId == user.UserId || this.userMessages[i].UserSenderId == user.UserId) {
                this.modalDialogData.userMessages.push(this.userMessages[i]);
            }
        }
        let self = this;
        setTimeout(() => {
            self.autoScroller();
        }, 700);
    }

    onModalClosed() {
        this.modalDialogIndicator = false;
    }

    autoScroller() {
        let element = document.getElementById('panel-body');
        element.scrollTop = 10000;        
    }

    sendMessageToUser(message) {
        this.proxy.invoke("SendMessage", JSON.stringify(message), this.modalDialogData.UserEmail);
    }

    sendMessage() {
        let message = this.userInput.text;
        this.userInput.text = "";
        this.userMessageService.sendMessage({ Id: this.userInfo.UserId, AuthorId: this.userInfo.UserId, UserSenderId: this.userInfo.UserId, UserResiverId: this.modalDialogData.UserId, MessageText: message, DateCreated: new Date() })
            .then(data => {                
                if (data != "") {
                    let temMessage = JSON.parse(data);
                    temMessage["DateCreated"] = new Date(parseInt(temMessage["DateCreated"].substring(6)));
                    this.modalDialogData.userMessages.push(temMessage);
                    this.userMessages.push(temMessage);
                    this.sendMessageToUser(temMessage);
                    let self = this;
                    setTimeout(() => {
                        self.autoScroller();
                    }, 700);                   
                }
            }).catch(err => {
                this.createNotification('error', 'warning', 'Internet connection error');
            });
    }

    ngOnDestroy() {
        this.conneciton.stop();
    }
}