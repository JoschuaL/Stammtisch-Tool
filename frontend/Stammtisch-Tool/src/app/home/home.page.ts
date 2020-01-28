import { Component, OnDestroy, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Storage } from '@ionic/storage';

import { NetworkStatus, PluginListenerHandle, Plugins } from '@capacitor/core';
import { ReportFilesystemService } from '../report/report-filesystem.service';
import { LoadingController, PopoverController, ToastController } from '@ionic/angular';
import { RetryComponent } from '../report/retry/retry.component';
import { ReportDatabaseService } from '../report/report-database.service';
import { LogoutComponent } from '../auth/logout/logout.component';

const { Network } = Plugins;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    Locations: string[];
    SelectedLocation = '';
    unsubmittedNumber = 0;
    connected = true;
    // callback for the retry overlay
    refresher = () => this.loadStatusNumbers();


    ngOnInit() {

        this.loadStatusNumbers();


        this.storage.get('locations')
            .then(ret => {
                const locs: string[] = JSON.parse(ret);
                this.Locations = locs;
                this.logger.debug(locs);
                this.storage.get('last_location').then(val => {
                    if (val && val !== '' && this.Locations.includes(val)) {
                        this.SelectedLocation = val;
                    } else {
                        if (this.Locations.length > 0) {
                            this.changeLocation(this.Locations[0]);
                        }
                    }
                });
            });

    }

    /**
     * To Load numbers of unsubmitted and failed reports from storage
     */
    async loadStatusNumbers() {
        this.unsubmittedNumber = await this.reportFilesystem.getStatusNumbers();
    }




    setConnection(connected: boolean) {
        this.connected = connected;
    }



    /**
     * Change the currently selected location
     * @param loc the location we're changing to
     */
    async changeLocation(loc: string) {
        this.logger.debug(loc);
        this.SelectedLocation = loc;
        await this.storage.set('last_location', loc);
    }

    /**
     * Retry all failed submissions, overwriting their status and id on a success
     */
    async retrySubmission() {

        const toRetry = await this.reportFilesystem.getUnsubmittedReports();
        const loading = await this.loadingController.create({
            message: 'attempting sending report 0 of ' + toRetry.length + ', 0 failed'
        });
        let failed = 0;
        await loading.present();
        for (const report of toRetry) {
            try {
                const id = await this.reportDatabase.send(report);
                if (id == null) {
                    failed++;
                    loading.message = 'attempting sending report 0 of ' + toRetry.length + ', ' + failed + ' failed';
                } else {
                    report.id = id;
                    await this.reportFilesystem.addOwnReport(report);
                }
            } catch (e) {
                failed++;
                loading.message = 'attempting sending report 0 of ' + toRetry.length + ', ' + failed + ' failed';
            }
        }
        await loading.dismiss();
        const toast = await this.toastController.create({
            header: 'Retry',
            message: (toRetry.length - failed) + ' successfully sent, ' + failed + ' failed',
            position: 'bottom',
            duration: 2000,
            buttons: [
                {
                    side: 'end',
                    text: 'close',
                    role: 'cancel'
                }
            ]
        });
        await toast.present();
    }

    /**
     * Show the Retry popover
     * @param ev the click event for proper placement
     */
    async presentRetryPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: RetryComponent,
            componentProps: {
                num: this.unsubmittedNumber,
                retryCallback: async () => {
                    await popover.dismiss();
                    await this.retrySubmission();
                    await this.loadStatusNumbers();
                },
                online: this.connected
            },
            event: ev,
            translucent: true,
            keyboardClose: true,
        });
        await popover.present();
    }

    /**
     * Show the Logout popover
     * @param ev the click event for proper placement
     */
    async presetLogoutPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: LogoutComponent,
            componentProps: {
                dismissCallback: async () => await popover.dismiss()
            },
            event: ev,
            translucent: true,
            keyboardClose: true
        });
        await popover.present();
    }


    constructor(
        private logger: NGXLogger,
        private storage: Storage,
        private reportFilesystem: ReportFilesystemService,
        private popoverController: PopoverController,
        private loadingController: LoadingController,
        private reportDatabase: ReportDatabaseService,
        private toastController: ToastController
    ) {
    }

}


