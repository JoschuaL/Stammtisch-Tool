import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {StatsPage} from './stats.page';

const routes: Routes = [
    {
        path: '',
        component: StatsPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
    ],
    declarations: [StatsPage],
    providers: [
        {provide: DatePipe, useClass: DatePipe, deps: []}
    ]

})
export class StatsPageModule {
}
