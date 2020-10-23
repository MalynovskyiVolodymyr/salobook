import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationsService, SimpleNotificationsComponent, PushNotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { Observable } from 'rxjs/Rx';
import { UserService } from './../services/user-service';
import { routerTransition } from './../../animation/router-animation';

class CapthaModel {
    Id: number;
    ImgUrl: string;
    VerificationKey: string;
}

@Component({
    templateUrl: 'app/products/authcomponent/user-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class UserRegisterComponent {
    userName: FormControl;
    email: FormControl;
    password: FormControl;
    passwordConfirm: FormControl;
    customvalidator: FormControl;
    coolForm: FormGroup;  
    public options = {
        timeOut: 4000,
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
    
    capthaVerification: CapthaModel={
        Id:1,
        ImgUrl:"",
        VerificationKey:""
    };


    constructor(private formBuilder: FormBuilder, private router: Router, private _cookieSecive: CookieService, private _userService: UserService, private _service: NotificationsService, private _push: PushNotificationsService) {
        this.userName = new FormControl('', [Validators.required, Validators.minLength(5)]);
        this.email = new FormControl('', [Validators.required, Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)]);
        this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);
        this.passwordConfirm = new FormControl('', [Validators.required, Validators.minLength(6)]);
        this.customvalidator = new FormControl('', [Validators.required]);            
        
        this.coolForm = formBuilder.group({
            userName: this.userName,
            email: this.email,
            password: this.password,
            passwordConfirm: this.passwordConfirm,
            customvalidator: this.customvalidator
        });
    }

    ngAfterViewInit() {
        this.getCapthaImage();
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

    getCapthaImage() {
        this.animLoaderStart();
        this._userService.getCaptha().then(data => {
            this.capthaVerification = JSON.parse(data);
            this.animLoaderStop();
        }).catch(err => {
            this.animLoaderStop();
            this._service.error(this.title, "Internet connection error");
        });
    }

    public title: string = 'Warning';
    public content: string = 'user with such email address alredy exists or captcha verification was not passed';

    create() {
        this._service.error(this.title, this.content);
    }

    registerNewUser() {    
        if (this.coolForm.value["email"].length == 0
            || this.coolForm.value["password"].length == 0
            || this.coolForm.value["userName"].length == 0
            || this.coolForm.value["passwordConfirm"].length == 0
            || this.coolForm.value["customvalidator"].length == 0) {
            return;
        }  
        if (this.coolForm.value["password"] !== this.coolForm.value["passwordConfirm"]) {
            this._service.error(this.title, "Passwords are not equals");
            return;
        }
        this.animLoaderStart();   
        let tempUser = {
            captchaid: this.capthaVerification.Id,
            email: this.coolForm.value["email"],
            password: this.coolForm.value["password"],
            passwordConfirm: this.coolForm.value["passwordConfirm"],
            customvalidator: this.coolForm.value["customvalidator"],
            userName: this.coolForm.value["userName"]
        } 
        this._userService.register(tempUser).then(data => {
            this.animLoaderStop();
            if (this._userService.checkIfAuthorize()) {
                this.router.navigateByUrl('/account');
            } else {
                this.create();
            }
        }).catch(err => {
            this.animLoaderStop();
            this.create();            
        });        
    }
} 