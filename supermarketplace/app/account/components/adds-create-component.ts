import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Addsservice } from './../services/user-adds-service';
import { routerTransition } from './../../animation/router-animation';

class AdvertisingModel {
    public Title: string;
    public InnerText: string;
    public BackroundImage: any;
    public InnerImage: any;
}

@Component({
    templateUrl: 'app/account/components/adds-create-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class AddsNewComponent {
    public item: AdvertisingModel ={
        Title: "",
        InnerText: "",
        BackroundImage: null,
        InnerImage: null
    };

    constructor(private router: Router, private addsService: Addsservice) {
        
    }

    saveAddsInfo() {

        var formData: FormData = new FormData();
        var xmlhttp: XMLHttpRequest = new XMLHttpRequest();

        formData.append("Title", this.item.Title);

        formData.append("InnerText", this.item.InnerText);

        if (this.item.BackroundImage != undefined) {
            formData.append("InnerImage", this.item.InnerImage[0], this.item.InnerImage[0].name);
        } else {
            formData.append("InnerImage", 0);
        }

        if (this.item.BackroundImage != undefined) {
            formData.append("BackroundImage", this.item.BackroundImage[0], this.item.BackroundImage[0].name);
        } else {
            formData.append("BackroundImage", 0);
        }

        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {                    
                    if (JSON.parse(xmlhttp.response)) {
                        this.router.navigate(['/account/advertaising']);
                    }
                } else {
                    
                }
                $('#backroundInput').val("");
                $('#innerInput').val("");
                this.item.InnerImage = null;
                this.item.BackroundImage = null;
            }
        };
        xmlhttp.open('POST', '/adminaction/CreateNewAdvertising');
        xmlhttp.send(formData);

    }

    saveAddsImage() {

    }

    onBackroundChange(event) {
        this.item.BackroundImage = event.srcElement.files;
    }

    onInnerItemChange(event) {
        this.item.InnerImage = event.srcElement.files;
    }
}

