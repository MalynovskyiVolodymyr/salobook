import { Component } from '@angular/core';
import { UserAccountService } from './../services/user-account-service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService, SimpleNotificationsComponent, PushNotificationsService } from 'angular2-notifications';
import { routerTransition } from './../../animation/router-animation';

class UserInfoViewModel {
    public UserId: number;
    public UserEmail: string;
    public DateCreated: Date;
    public UserName: string;
    public UserBackgroundImage: string;
    public ImgUrl: string;
    public FriendRequests: Array<any>;
    public Friends: Array<any>;
    public MyFriendsRequests: Array<any>;   
    public Messages: Array<any>;
}

@Component({
    templateUrl: 'app/account/components/user-friends-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class UserFriendsComponent {
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
        Messages: []
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

    public currentUserInfo: any;

    public userFrinedSearchResult: Array<any>;
    public userFriendsRequests: Array<any>;
    public userMyFriendsRequests: Array<any>;
    public userFriends: Array<any>;

    constructor(private userAccountService: UserAccountService, private router: Router, private _service: NotificationsService, private _push: PushNotificationsService) {
        
        this.conneciton = $.hubConnection();

        this.proxy = this.conneciton.createHubProxy("Messanger");

        this.proxy.on("friendRequest", (resp) => {           
            this.userFriendsRequests.unshift(JSON.parse(resp))
        });

        this.proxy.on("removeFriendRequest", (resp) => {           
            this.excludeUnnesessaryUser(JSON.parse(resp), this.userFriendsRequests);
        });

        this.proxy.on("addFriend", (resp) => {
            let tempUser = JSON.parse(resp);            
            this.userFriends.unshift(tempUser);
            this.excludeUnnesessaryUser(tempUser, this.userMyFriendsRequests);
        });

        this.proxy.on("removeFriend", (resp) => {            
            this.excludeUnnesessaryUser(JSON.parse(resp), this.userFriends);
        });

        this.proxy.on("sendMessage", (resp) => {
            this.createNotification(JSON.parse(resp));
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

    createNotification(tempMessage) {
        for (let i = 0; i < this.userFriends.length; i++) {
            if (this.userFriends[i]['UserId'] == tempMessage['UserSenderId']) {
                this._service.info(this.userFriends[i]['UserName'], 'new message');
            }
        } 
    }

    animLoaderStop() {
        let anime = $('.animator');
        if (anime != undefined) {
            anime.addClass('remove-loader');
        }
    } 

    sendUserFriendRequest(user) {
        this.animLoaderStart();
        user['DateCreated'] = new Date();
        this.userAccountService.userFriendReguest(user).then(data => {  
            this.animLoaderStop(); 
            if (data != "") {
                let response = JSON.parse(data);
                this.sendFriendRequest(response["UserEmail"]);                
                this.removeItemFromArray(response, this.userFrinedSearchResult);
                this.userMyFriendsRequests.unshift(response)
            }            
        }).catch(err => {
            this.animLoaderStop();
            this._service.error('warning', 'Internet connection error');
        });
    }

    sendFriendRequest(userEmail) {          
        this.proxy.invoke("SendFriedsRequest", JSON.stringify(this.currentUserInfo), userEmail);
    }

    removeUserFriend(friendToRemove) {
        this.animLoaderStart();
        friendToRemove['DateCreated'] = new Date();
        this.userAccountService.userRemoveFriend(friendToRemove).then(data => {
            this.animLoaderStop(); 
            if (data != "") {
                let tempUser = JSON.parse(data);
                this.removeUserFriendReg(tempUser["UserEmail"]);
                this.excludeUnnesessaryUser(JSON.parse(data), this.userFriends);                
            }
        }).catch(err => {
            this.animLoaderStop();
            this._service.error('warning', 'Internet connection error');
        })
    }

    removeUserFriendReg(userEmail) {
        this.proxy.invoke("RemoveFromFriends", JSON.stringify(this.currentUserInfo), userEmail);
    }

    removeFriendRequest(requestToRemove) {
        this.animLoaderStart();
        requestToRemove['DateCreated'] = new Date();
        this.userAccountService.userRemoveFreindRequest(requestToRemove).then(data => {
            this.animLoaderStop(); 
            if (data != "") {
                let tempUser = JSON.parse(data);
                this.removeFriedRequest(tempUser["UserEmail"]);
                this.excludeUnnesessaryUser(tempUser, this.userMyFriendsRequests);
            }
        }).catch(err => {
            this.animLoaderStop(); 
            this._service.error('warning', 'Internet connection error');
        });
    }

    removeFriedRequest(userEmail) {
        this.proxy.invoke("RemoveFriedsRequest", JSON.stringify(this.currentUserInfo), userEmail);
    }

    addNewFriend(newFriend) {
        this.animLoaderStart();
        newFriend['DateCreated'] = new Date();
        this.userAccountService.userAddNewFriend(newFriend).then(data => {
            this.animLoaderStop(); 
            if (data != "") {
                let tempUser = JSON.parse(data);
                this.userFriends.unshift(tempUser);
                this.addNewUserRequest(tempUser["UserEmail"]);
                this.excludeUnnesessaryUser(tempUser, this.userFriendsRequests);
            }
        }).catch(err => {
            this.animLoaderStop(); 
            this._service.error('warning', 'Internet connection error');
        });
    }

    addNewUserRequest(userEmail) {
        this.proxy.invoke("AddToFriends", JSON.stringify(this.currentUserInfo), userEmail);
    }

    excludeUnnesesaryData(response: Array<UserInfoViewModel>) {
        for (let i = 0; i < response.length; i++) {
            if (response[i].UserEmail == this.userInfo.UserEmail) {
                this.removeItemFromArray(i, this.userFrinedSearchResult);
            }
            if (this.customIndexOf(response[i], this.userFriendsRequests) || this.customIndexOf(response[i], this.userMyFriendsRequests) || this.customIndexOf(response[i], this.userFriends)) {
                this.removeItemFromArray(i, this.userFrinedSearchResult);
            }
        }
    }

    excludeUnnesessaryUser(userToRemove:UserInfoViewModel, actionArray: Array<UserInfoViewModel>) {
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

    initUserAccountPage() {
        this.animLoaderStart();
        this.userAccountService.getUserFriendsData().then(data => {
            this.animLoaderStop(); 
            if (data != "") {
                this.userInfo = JSON.parse(data);                
                this.userFriendsRequests = this.userInfo.FriendRequests;
                this.userMyFriendsRequests = this.userInfo.MyFriendsRequests;
                this.userFriends = this.userInfo.Friends;
                if (this.userFriends.length == 0) {
                    this.userFriends = JSON.parse(this.userAccountService.getUserFriends());
                }
                this.currentUserInfo = {
                    UserId: this.userInfo.UserId,
                    UserEmail: this.userInfo.UserEmail,
                    DateCreated: this.userInfo.DateCreated,
                    UserName: this.userInfo.UserName,
                    UserBackgroundImage: this.userInfo.UserBackgroundImage,
                    ImgUrl: this.userInfo.ImgUrl
                }            
            }
        }).catch(err => {
            this.animLoaderStop(); 
            this._service.error('warning', 'Internet connection error');
        });
    }

    visitFriendPage(userFriend) {
        sessionStorage.removeItem("friendData");
        sessionStorage.setItem("friendData", JSON.stringify(userFriend));
        this.router.navigate(['/account/friend']);
    }

    removeItemFromArray(index: any, items: Array<any>) { 
        items.splice(index, 1);           
    }

    ngAfterViewInit() {
        this.initUserAccountPage();
    }

    searchForUsers(username: string) {
        this.userAccountService.searchForUsers(username).then(data => {
            if (data != "") {
                this.userFrinedSearchResult = JSON.parse(data);              
                this.excludeUnnesesaryData(this.userFrinedSearchResult);
            } else {
                delete this.userFrinedSearchResult;
            }
            
        }).catch(err => {
            this._service.error('warning', 'Internet connection error');
        });
    }

    ngOnDestroy() {
        this.conneciton.stop();
    }
}