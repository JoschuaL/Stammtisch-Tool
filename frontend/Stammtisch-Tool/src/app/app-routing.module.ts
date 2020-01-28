import {NgModule} from '@angular/core';
import {PreloadAllModules, Router, RouterModule, Routes} from '@angular/router';
import {environment} from '../environments/environment';
import {AuthGuard} from './auth/auth.guard';
import {AuthService, authServiceFactory} from './auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {Storage} from '@ionic/storage';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)},
    {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard]},
    {path: 'status/:scope', loadChildren: () => import('./status/status.module').then(m => m.StatusPageModule), canActivate: [AuthGuard]},
    {path: 'stats', loadChildren: () => import('./stats/stats.module').then(m => m.StatsPageModule), canActivate: [AuthGuard]},
    {path: 'edit', loadChildren: () => import('./edit/edit.module').then(m => m.EditPageModule), canActivate: [AuthGuard]},
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, enableTracing: !environment.production})
    ],
    exports: [RouterModule],
    providers: [
        {provide: AuthService, useFactory: authServiceFactory, deps: [HttpClient, NGXLogger]},
        {provide: AuthGuard, useClass: AuthGuard, deps:[NGXLogger, AuthService, Router, Storage]}
    ]
})
export class AppRoutingModule {
}
