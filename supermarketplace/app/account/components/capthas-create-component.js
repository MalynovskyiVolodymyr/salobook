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
var router_1 = require("@angular/router");
require("rxjs/Rx");
var router_animation_1 = require("./../../animation/router-animation");
var CpthaModel = (function () {
    function CpthaModel() {
    }
    return CpthaModel;
}());
var CapthasNewComponent = (function () {
    function CapthasNewComponent(router) {
        this.router = router;
        this.item = {
            VerificationKey: ""
        };
    }
    CapthasNewComponent.prototype.saveCapthaInfo = function () {
        var _this = this;
        var formData = new FormData();
        var xmlhttp = new XMLHttpRequest();
        formData.append("verificationCode", this.item.VerificationKey);
        if (this.itemImage != undefined) {
            formData.append("image", this.itemImage[0], this.itemImage[0].name);
        }
        else {
            formData.append("image", 0);
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    console.log(xmlhttp.response);
                    if (JSON.parse(xmlhttp.response)) {
                        _this.router.navigate(['/account/capthas']);
                    }
                }
                else {
                    console.log('image size must be less than 500 kb');
                }
                $('#innerInput').val("");
                _this.itemImage = null;
            }
        };
        xmlhttp.open('POST', '/adminaction/CreateNewCaptha');
        xmlhttp.send(formData);
    };
    CapthasNewComponent.prototype.onCapthaImageChange = function (event) {
        this.itemImage = event.srcElement.files;
        var _capthaPreview = this.capthaPreview;
        var reader = new FileReader();
        reader.onload = function (e) {
            _capthaPreview(e.target['result']);
        };
        reader.readAsDataURL(this.itemImage[0]);
    };
    CapthasNewComponent.prototype.capthaPreview = function (imageUrl) {
        $('#imgPreview').attr('src', imageUrl);
    };
    CapthasNewComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/account/components/capthas-create-component.html',
            animations: [router_animation_1.routerTransition()],
            host: { '[@routerTransition]': '' }
        }),
        __metadata("design:paramtypes", [router_1.Router])
    ], CapthasNewComponent);
    return CapthasNewComponent;
}());
exports.CapthasNewComponent = CapthasNewComponent;
