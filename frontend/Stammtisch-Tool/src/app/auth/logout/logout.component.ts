import {Component, Input, OnInit} from '@angular/core';
import {Plugins} from '@capacitor/core';
import {Storage} from '@ionic/storage';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {NGXLogger} from 'ngx-logger';
import {AuthService} from '../auth.service';

const {Modals} = Plugins;

/**
 * Component for the logout overlay
 */
@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
    /**
     * For dismissing the overlay from the caller site
     */
    @Input() dismissCallback: () => Promise<void>;

    constructor(
        private storage: Storage,
        private route: ActivatedRoute,
        private router: Router,
        private loadingController: LoadingController,
        private logger: NGXLogger,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
    }

    /**
     * Logs the user out, deleting all persistent data in the process
     */
    async logout() {

        const decision = await Modals.confirm({
            title: 'Logout',
            message: 'Logging out will delete all unsaved data, including reports that have not yet been uploaded. \n' +
                'Are you sure you want to continue?'
        });
        if (decision.value) {

            const loading = await this.loadingController.create({
                message: 'deleting all data'
            });
            await this.dismissCallback();
            await loading.present();
            try {
                const response = await this.authService.logout();
                if (!response) {
                    await loading.dismiss();
                    this.partialLogout();
                    return;
                }
            } catch (e) {
                await loading.dismiss();
                this.partialLogout();
                return;
            }
            await this.storage.clear();
            await loading.dismiss();
            await this.router.navigate(['/login']);

        }
        await this.dismissCallback();
    }

    async partialLogout() {
        const decision = await Modals.confirm({
            title: 'Failed to log out on server',
            message: 'Failed to log out on server. Continue anyways? (your local data will still be deleted)',
        });
        if (decision.value) {
            const loading = await this.loadingController.create({
                message: 'deleting all data'
            });
            await loading.present();
            await this.storage.clear();
            await loading.dismiss();
            await this.router.navigate(['/login']);
        }
    }

}
