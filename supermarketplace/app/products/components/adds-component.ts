import { Component, Input } from '@angular/core';

@Component({
    selector: 'addscomponent',
    templateUrl:'app/products/components/adds-component.html'
})
export class AddsComponent {
    public indicator: number = 1;
    @Input()
    public InputAdvertisingImg: Array<any>;
    public advertisingImg: Array<any>;
    constructor() {
        setTimeout(() => {
            $('.carousel.fade-carousel.slide').carousel({ interval: 4000 });
        }, 0);
       
    }

    ngOnChanges() {
        if (this.InputAdvertisingImg != null && this.InputAdvertisingImg.length) {
            this.advertisingImg = this.InputAdvertisingImg;
            this.indicator = this.advertisingImg[0].Id;
        }
    }
}