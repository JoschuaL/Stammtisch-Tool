import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../auth/account';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
    accountForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
    });

    private authSubscription: Subscription;

    error = '';
    connection = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private logger: NGXLogger,
        private loadingController: LoadingController,
        private storage: Storage
    ) {
    }

    ngOnInit() {
        // skip login page if we are already logged in
        this.storage.get('logged_in').then(
            loggedIn => {
                if (loggedIn) {
                    this.router.navigate(['/home']);
                }
            }
        );
    }

    ngOnDestroy() {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
    }

    setConnection(connection: boolean) {
        this.connection = connection;
    }

    /**
     * authenticates the user with the authentication service
     * @param account the account data acquired from the login form
     */
    async authenticateUser(account: Account) {
        this.logger.debug(account);
        const loading = await this.loadingController.create({
            message: 'Please wait'
        });
        await loading.present();
        let response;
        try {
            response = await this.auth.authenticate(account.username, account.password);
        } catch (e) {
            if (e === 'Incorrect username or password' || e.message === 'Incorrect username or password') {
                this.error = 'Incorrect username or password';
            } else {
                this.error = 'Unable to connect to service';
            }
            this.logger.error(e);
            await loading.dismiss();
            return;
        }
        this.error = '';
        this.logger.info(response);
        const loc = response && response.locations ? response.locations : [];
        await this.storage.set('logged_in', true);
        await this.storage.set('auth_token', response.access_token);
        await this.storage.set('username', response.name);
        await this.storage.set('locations', JSON.stringify(loc));
        await loading.dismiss();
        await this.router.navigate(['/home']);


    }

}
