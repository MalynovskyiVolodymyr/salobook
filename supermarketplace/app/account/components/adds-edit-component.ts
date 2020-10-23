import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Addsservice } from './../services/user-adds-service';
import { routerTransition } from './../../animation/router-animation';

@Component({
    templateUrl: 'app/account/components/adds-edit-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class AddsEditComponent {
    public itemToEdit: any = null;
    public categories: Array<any> = [];
    innerItemfiles: any;
    backroundfiles: any;
    constructor(private router: Router, private addsService: Addsservice) {
        this.itemToEdit = JSON.parse(sessionStorage.getItem('tempData'));
        sessionStorage.removeItem('tempData');
    }

    updateAddsInfo() {
        this.addsService.updateAddsInfo(this.itemToEdit).then(data => {
            this.itemToEdit = JSON.parse(data);
        });
    }

    updateAdds() {

        var formData: FormData = new FormData();
        var xmlhttp: XMLHttpRequest = new XMLHttpRequest();
      
        formData.append("Id", this.itemToEdit.Id);       
        
        if (this.innerItemfiles != undefined) {
            formData.append("bannerItemfiles", this.innerItemfiles[0], this.innerItemfiles[0].name);
        } else {
            formData.append("bannerItemfiles", 0);
        }

        if (this.backroundfiles != undefined) {
            formData.append("backroundfiles", this.backroundfiles[0], this.backroundfiles[0].name);
        } else {
            formData.append("backroundfiles", 0);
        }

        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                                      
                    this.itemToEdit = JSON.parse(xmlhttp.response);
                } else {
                    
                }
                $('#backroundInput').val("");
                $('#innerInput').val("");
                this.innerItemfiles = null;
                this.backroundfiles = null;
            }
        };
        xmlhttp.open('POST', '/adminaction/UpdateAddsImage');
        xmlhttp.send(formData);

    }

    onInnerItemChange(event) {
        this.innerItemfiles = event.srcElement.files;
    }

    onBackroundChange(event) {
        this.backroundfiles = event.srcElement.files;
    }
}