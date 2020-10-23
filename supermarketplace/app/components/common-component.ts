import { Component } from '@angular/core';
import { routerTransition } from './../animation/router-animation';

@Component({
    selector: 'supermarket-place',
    template: '<router-outlet></router-outlet>', //'app/components/common-component.html'
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class AppComponent {
    
}
