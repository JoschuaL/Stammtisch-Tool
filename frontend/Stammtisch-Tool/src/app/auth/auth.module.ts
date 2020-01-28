import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LogoutComponent} from './logout/logout.component';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import { AuthService, authServiceFactory } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';


@NgModule({
    declarations: [LogoutComponent],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule
    ],
    exports: [LogoutComponent],
    providers: [{ provide: AuthService, useFactory: authServiceFactory, deps: [HttpClient, NGXLogger] }],
    // Needed till angular 9 hits release
    entryComponents: [LogoutComponent]
})
export class AuthModule {
}
