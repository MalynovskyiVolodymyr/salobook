import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserProductsService } from './../services/user-products-service';
import { routerTransition } from './../../animation/router-animation';

@Component({
    templateUrl: 'app/account/components/user-product-edit-component.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class UserEditComponent {
    public itemToEdit: any = null;
    public categories: Array<any> = [];
    files: any;
    constructor(private router: Router, private productService: UserProductsService) {
        this.itemToEdit = JSON.parse(sessionStorage.getItem('tempData'));
        sessionStorage.removeItem('tempData');        
    }

    ngAfterViewInit() {
        this.productService.getListOfCategories().then(categories => {
            this.categories = JSON.parse(categories);
        }).catch(error => {
            
        });
    }

    makeFileRequest() {
        
        let formData: FormData = new FormData(),
            xhr: XMLHttpRequest = new XMLHttpRequest();

        formData.append("Id", this.itemToEdit.Id);
        formData.append("Title", this.itemToEdit.Title);
        formData.append("DateCreated", new Date().toDateString());
        formData.append("Description", this.itemToEdit.Description);
        formData.append("UserId", this.itemToEdit.UserId);
        formData.append("ImgUrl", this.itemToEdit.ImgUrl);
        formData.append("CategoryId", this.itemToEdit.CategoryId);
        if (this.files != undefined) {
            formData.append("image", this.files[0], this.files[0].name); 
        } else {
            formData.append("image", 0); 
        }  

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log(xhr.response)
                    this.itemToEdit = JSON.parse(xhr.response);
                } else {
                    console.log('image size must be less than 500 kb');                    
                }
            }
        };
        xhr.open('POST', '/adminaction/UpdateProductImage');
        xhr.send(formData);
        
    }
 
    productPreview(imageUrl: any) {
        $('#itemImagePreview').attr('src', imageUrl);
    }
    
    onChange(event) {        
        this.files = event.srcElement.files;
        var _productPreview = this.productPreview;
        var reader = new FileReader();
        reader.onload = function (e) {
            _productPreview(e.target['result']);
        }
        reader.readAsDataURL(this.files[0]);
    }    
}