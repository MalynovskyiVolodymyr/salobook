import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileService } from './../services/user-profile-service';
import { UserAccountService } from './../services/user-account-service';
import { NotificationsService, SimpleNotificationsComponent, PushNotificationsService } from 'angular2-notifications';
import { routerTransition } from './../../animation/router-animation';

interface UserProfileViewModel {
    UserName: string;
    Password: string;
    NewPassword: string;
    NewPasswordConfirm: string;
    UserBackgroundImage: any;
    ImgUrl: any;
}

@Component({
    templateUrl: 'app/account/components/user-profile-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class UserProfileComponent {
    private conneciton: SignalR.Hub.Connection;
    private proxy: SignalR.Hub.Proxy;
    
    public profileToEdit: UserProfileViewModel = {
        UserName: "",
        Password: "",
        NewPassword: "",
        NewPasswordConfirm: "",        
        UserBackgroundImage: "",
        ImgUrl:""
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
    public categories: Array<any> = [];
    innerItemfiles: any;
    backroundfiles: any;

    constructor(private router: Router, private userProfileService: UserProfileService, private userAccountService: UserAccountService, private _service: NotificationsService, private _push: PushNotificationsService) {
        this.conneciton = $.hubConnection();

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
        this.userAccountService.getUserFriendsAndMessages()
            .then(data => {
                if (data != "") {
                    this.profileToEdit = JSON.parse(data);
                } else {
                    this.createNotification('error', 'warning', 'Internet connection error');
                }
            }).catch(err => {
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

    updateUserProfilepassword() {
        if (this.profileToEdit.Password == undefined || this.profileToEdit.NewPassword == undefined || this.profileToEdit.NewPassword !== this.profileToEdit.NewPasswordConfirm) {
            this.createNotification('error', 'warning', 'passwords are empty or do not match');
            return;
        }
        this.profileToEdit.UserName = "";
        this.profileToEdit.UserBackgroundImage = 0;
        this.profileToEdit.ImgUrl = 0;
        this.animLoaderStart(); 
        this.userProfileService.updateUserProfile(this.profileToEdit).then(data => {
            if (data != "") {
                this.animLoaderStop();
                this.profileToEdit = JSON.parse(data);
            } else {
                this.animLoaderStop();
                this.createNotification('error', 'warning', 'incorrect password');
            }
        }).catch(err => {
            this.animLoaderStop();
            this.createNotification('error', 'warning', 'Internet connection error');
        });
    }

    updateUserName() {
        if (this.profileToEdit.UserName == undefined) {
            this.createNotification('error', 'warning', 'enter your new name');
            return;
        }
        this.profileToEdit.NewPassword = "";
        this.profileToEdit.Password = "";
        this.profileToEdit.NewPasswordConfirm = "";
        this.profileToEdit.ImgUrl = 0;
        this.profileToEdit.UserBackgroundImage = 0;   
        this.animLoaderStart();  
        this.userProfileService.updateUserProfile(this.profileToEdit).then(data => {
            if (data != "") {
                this.animLoaderStop();
                this.profileToEdit = JSON.parse(data);
            } else {
                this.animLoaderStop();
                this.createNotification('error', 'warning', 'Internet connection error');
            }
        }).catch(err => {
            this.animLoaderStop();
            this.createNotification('error', 'warning', 'Internet connection error');
        });
    }

    updateProfilePictures() {
        if (this.innerItemfiles == undefined && this.backroundfiles == undefined) {
            this.createNotification('error', 'warning', 'chose picture to send');
            return;
        }
        var formData: FormData = new FormData();
        var xmlhttp: XMLHttpRequest = new XMLHttpRequest();        

        formData.append("UserName", "");
        formData.append("Password", "");
        formData.append("NewPassword", "");
        formData.append("NewPasswordConfirm", "");
 
        if (this.innerItemfiles != undefined) {
            formData.append("ImgUrl", this.innerItemfiles[0], this.innerItemfiles[0].name);
        } else {
            formData.append("ImgUrl", 0);
        }

        if (this.backroundfiles != undefined) {
            formData.append("UserBackgroundImage", this.backroundfiles[0], this.backroundfiles[0].name);
        } else {
            formData.append("UserBackgroundImage", 0);
        }
        this.animLoaderStart();
        xmlhttp.onreadystatechange = () => {            
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {   
                    this.animLoaderStop(); 
                    try {
                        this.profileToEdit = JSON.parse(xmlhttp.response);
                    } catch(err){
                        this.createNotification('error', 'warning', 'image size must be less than 500 kb');
                    } 
                } else {
                    this.animLoaderStop();             
                }
                this.animLoaderStop();
                $('#backroundInput').val("");
                $('#innerInput').val("");
                this.innerItemfiles = null;
                this.backroundfiles = null;
            }
        };
        
        xmlhttp.open('POST', '/accountaction/UpdateUserProfile');
        xmlhttp.send(formData);

    }

    onInnerItemChange(event) {
        this.innerItemfiles = event.srcElement.files;       
        var _innerItemPreview = this.innerItemPreview;
        var reader = new FileReader();
        reader.onload = function (e) {
            _innerItemPreview(e.target['result']);
        }
        reader.readAsDataURL(this.innerItemfiles[0]);
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

    onBackroundChange(event) {
        this.backroundfiles = event.srcElement.files;
        var _backgroundItemPreview = this.backgroundItemPreview;
        var reader = new FileReader();
        reader.onload = function (e) {
            _backgroundItemPreview(e.target['result']);
        }
        reader.readAsDataURL(this.backroundfiles[0]);
    }

    innerItemPreview(imageUrl: any) {
        $('#innerImage').attr('src', imageUrl);
    }

    backgroundItemPreview(imageUrl: any) {
        $('#backgroundImage').attr('src', imageUrl);
    }

    ngOnDestroy() {
        this.conneciton.stop();
    }

}