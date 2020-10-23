import { Component } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { routerTransition } from './../../animation/router-animation';

class CpthaModel {
    public VerificationKey: string;    
}

@Component({
    templateUrl: 'app/account/components/capthas-create-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class CapthasNewComponent {
    public item: CpthaModel = {
        VerificationKey: ""        
    };

    public itemImage: any;

    constructor(private router: Router) {

    }

    saveCapthaInfo() {

        var formData: FormData = new FormData();
        var xmlhttp: XMLHttpRequest = new XMLHttpRequest();

        formData.append("verificationCode", this.item.VerificationKey);

        if (this.itemImage != undefined) {
            formData.append("image", this.itemImage[0], this.itemImage[0].name);
        } else {
            formData.append("image", 0);
        }

        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    console.log(xmlhttp.response)
                    if (JSON.parse(xmlhttp.response)) {
                        this.router.navigate(['/account/capthas']);
                    }
                } else {
                    console.log('image size must be less than 500 kb');
                }
                
                $('#innerInput').val("");
                this.itemImage = null;
            }
        };
        xmlhttp.open('POST', '/adminaction/CreateNewCaptha');
        xmlhttp.send(formData);

    }

    onCapthaImageChange(event) {        
        this.itemImage = event.srcElement.files;
        var _capthaPreview = this.capthaPreview;
        var reader = new FileReader();
        reader.onload = function (e) {
            _capthaPreview(e.target['result']);            
        }
        reader.readAsDataURL(this.itemImage[0]);        
    }

    capthaPreview(imageUrl:any) {           
        $('#imgPreview').attr('src', imageUrl);        
    }
}