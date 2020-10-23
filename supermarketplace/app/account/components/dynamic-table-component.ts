import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Addsservice } from './../services/user-adds-service';
import { UserProductsService } from './../services/user-products-service';
import { Capthasservice } from './../services/user-captha-service';
import { UserUsersService } from './../services/user-users-service';

@Component({
    selector: 'dynamic-table',
    templateUrl: 'app/account/components/dynamic-table-component.html'
    
})
export class DynamicTableComponent {
    @Input()
    productsByCategory: Array<any>;

    public tableHead: Array<any> = new Array<any>();
    public tableBody: Array<any> = new Array<any>();
    private activatedUrl: string = "";

    constructor(private routerValue: ActivatedRoute, private router: Router, private addsService: Addsservice, private productService: UserProductsService, private capthasService: Capthasservice, private usersService: UserUsersService) {
        this.activatedUrl = routerValue.snapshot.url.join('');      
    }

    ngOnChanges() {        
        this.tableHead = [];
        this.tableBody = [];
        if (this.productsByCategory != null) {
            this.createDynamicTableHead(this.productsByCategory[0]);
            this.createDynamicTableRows(this.productsByCategory);
        }
    }   

    createDynamicTableHead(item:any) {
        for (let i in item) {          
            this.tableHead.push(i);            
        }
        
        console.log(this.tableHead);
    }

    actionEdit(item) {
        switch (this.activatedUrl) {
            case 'userproducts': {                
                sessionStorage.removeItem("tempData");
                sessionStorage.setItem("tempData", JSON.stringify(item));
                this.router.navigate(['/account/editproduct']);
                break;
            }
            case 'advertaising': {                
                sessionStorage.removeItem("tempData");
                sessionStorage.setItem("tempData", JSON.stringify(item));
                this.router.navigate(['/account/editadvertising']);
                break;
            }   
            case 'capthas': {                
                sessionStorage.removeItem("tempData");
                sessionStorage.setItem("tempData", JSON.stringify(item));
                this.router.navigate(['/account/editcaptcha']);
                break;
            }   
            case 'controlls': {
                sessionStorage.removeItem("tempData");
                sessionStorage.setItem("tempData", JSON.stringify(item));
                this.router.navigate(['/account/editcontroll']);
                break;
            }        
        }
        console.log('in edit => ', item);
    }

    actionDelete(item) {
        switch (this.activatedUrl) {
            case 'userproducts': {
                item.DateCreated = new Date(item.DateCreated).toJSON();
                this.productService.removeProductAdm(item).then(resp => {                    
                    this.removeItemFromArray(resp, item); 
                })
                break;
            }
            case 'advertaising': {
                this.addsService.removeAdds(item).then(resp => {
                    this.removeItemFromArray(resp, item);                     
                })
                break;
            }
            case 'capthas': {
                this.capthasService.removeCaptha(item).then(resp => {
                    this.removeItemFromArray(resp, item);
                })
                break;
            }
            case 'allusers': {
                this.usersService.removeUser(item).then(resp => {
                    this.removeItemFromArray(resp, item);
                })
                break;
            }
        }
    }

    allowPublicProduct(check, product) {
        if (!check) {
            return;
        }
        product['DateCreated'] = new Date();
        this.productService.getAdminAllowToPublic(product).then(response => {
            this.productsByCategory[this.productsByCategory.indexOf(product)]['IsChecked'] = true;
            this.productsByCategory[this.productsByCategory.indexOf(product)]['RequestToPublic'] = false;
        });
    }

    forsedAddToFriens(friend) {
        this.usersService.forsedAddToFriends(friend).then(data => {
            if (JSON.parse(data)) {
                alert("this user was added!");
            } else {
                alert("cannot add this user to friends!");
            }
        }).catch(err => {
            alert('error');
        });
    }

    removeItemFromArray(resp, item) {
        if (JSON.parse(resp)) {
            let index = this.tableBody.indexOf(item);
            if (index > -1) {
                this.tableBody.splice(index, 1);
            };
        } else {
            console.log('cannot remove item');
        }
    }

    createDynamicTableRows(items) {
        this.tableBody = items;        
    }  
}