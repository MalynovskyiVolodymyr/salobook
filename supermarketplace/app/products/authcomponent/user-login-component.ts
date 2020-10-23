import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationsService, SimpleNotificationsComponent, PushNotificationsService } from 'angular2-notifications';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { UserService } from './../services/user-service';
import { routerTransition } from './../../animation/router-animation';

@Component({
    templateUrl: 'app/products/authcomponent/user-login-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class UserLoginComponent {
    
    email: FormControl;
    password: FormControl;    
    coolForm: FormGroup;
    sub: any;
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

    constructor(private formBuilder: FormBuilder, private http: Http, private router: Router, private userservice: UserService, private _service: NotificationsService, private _push: PushNotificationsService) {

        this.email = new FormControl('', [Validators.required]);
        this.password = new FormControl('', [Validators.required]);

        this.coolForm = formBuilder.group({            
            email: this.email,
            password: this.password
        });
    }

    public title: string = 'Warning';
    public content: string = 'tour password is incorrect or the user does not exists';

    create() {
        this._service.error(this.title, this.content);
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

    authorize() {

        if (this.coolForm.value["email"].length == 0 || this.coolForm.value["password"].length == 0) {
            return;
        }     
        this.animLoaderStart();
        this.userservice.authenticate(this.coolForm.value).then(response => {
            this.animLoaderStop();
            if (this.userservice.checkIfAuthorize()) {
                this.router.navigateByUrl('/account');
            } else {
                this.create();
            }           
        }).catch(err => {
            this.animLoaderStop();
            this.create();
        });
    }

    ngOnDestroy() {
        if (!undefined === this.sub) {
            this.sub.unsubscribe();
        }        
    }
}