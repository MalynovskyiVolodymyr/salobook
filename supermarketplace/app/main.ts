import { enableProdMode } from '@angular/core'; 
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.main-module';

const platform = platformBrowserDynamic();
enableProdMode();
platform.bootstrapModule(AppModule);
