"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var angular2_notifications_1 = require("angular2-notifications");
var router_1 = require("@angular/router");
var core_2 = require("angular2-cookie/core");
var user_service_1 = require("./../services/user-service");
var router_animation_1 = require("./../../animation/router-animation");
var CapthaModel = (function () {
    function CapthaModel() {
    }
    return CapthaModel;
}());
var UserRegisterComponent = (function () {
    function UserRegisterComponent(formBuilder, router, _cookieSecive, _userService, _service, _push) {
        this.formBuilder = formBuilder;
        this.router = router;
        this._cookieSecive = _cookieSecive;
        this._userService = _userService;
        this._service = _service;
        this._push = _push;
        this.options = {
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
        this.capthaVerification = {
            Id: 1,
            ImgUrl: "",
            VerificationKey: ""
        };
        this.title = 'Warning';
        this.content = 'user with such email address alredy exists or captcha verification was not passed';
        this.userName = new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(5)]);
        this.email = new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)]);
        this.password = new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(6)]);
        this.passwordConfirm = new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(6)]);
        this.customvalidator = new forms_1.FormControl('', [forms_1.Validators.required]);
        this.coolForm = formBuilder.group({
            userName: this.userName,
            email: this.email,
            password: this.password,
            passwordConfirm: this.passwordConfirm,
            customvalidator: this.customvalidator
        });
    }
    UserRegisterComponent.prototype.ngAfterViewInit = function () {
        this.getCapthaImage();
    };
    UserRegisterComponent.prototype.animLoaderStart = function () {
        var anime = $('.animator.remove-loader');
        if (anime != undefined) {
            anime.removeClass('remove-loader');
        }
    };
    UserRegisterComponent.prototype.animLoaderStop = function () {
        var anime = $('.animator');
        if (anime != undefined) {
            anime.addClass('remove-loader');
        }
    };
    UserRegisterComponent.prototype.getCapthaImage = function () {
        var _this = this;
        this.animLoaderStart();
        this._userService.getCaptha().then(function (data) {
            _this.capthaVerification = JSON.parse(data);
            _this.animLoaderStop();
        }).catch(function (err) {
            _this.animLoaderStop();
            _this._service.error(_this.title, "Internet connection error");
        });
    };
    UserRegisterComponent.prototype.create = function () {
        this._service.error(this.title, this.content);
    };
    UserRegisterComponent.prototype.registerNewUser = function () {
        var _this = this;
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
        var tempUser = {
            captchaid: this.capthaVerification.Id,
            email: this.coolForm.value["email"],
            password: this.coolForm.value["password"],
            passwordConfirm: this.coolForm.value["passwordConfirm"],
            customvalidator: this.coolForm.value["customvalidator"],
            userName: this.coolForm.value["userName"]
        };
        this._userService.register(tempUser).then(function (data) {
            _this.animLoaderStop();
            if (_this._userService.checkIfAuthorize()) {
                _this.router.navigateByUrl('/account');
            }
            else {
                _this.create();
            }
        }).catch(function (err) {
            _this.animLoaderStop();
            _this.create();
        });
    };
    UserRegisterComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/products/authcomponent/user-component.html',
            animations: [router_animation_1.routerTransition()],
            host: { '[@routerTransition]': '' }
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, router_1.Router, core_2.CookieService, user_service_1.UserService, angular2_notifications_1.NotificationsService, angular2_notifications_1.PushNotificationsService])
    ], UserRegisterComponent);
    return UserRegisterComponent;
}());
exports.UserRegisterComponent = UserRegisterComponent;
