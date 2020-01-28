import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from './auth.service';
import { Plugins } from '@capacitor/core';
import { Storage } from '@ionic/storage';
const { Modals } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private logger: NGXLogger,
    private authService: AuthService,
    private router: Router,
    private storage: Storage
  ) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    try {
      const loggedIn: boolean = await this.authService.check();
      if (!loggedIn) {
        await Modals.alert({
          title: 'Session expired',
          message: 'Session expired. You have been logged out from the server. Please log in again'
        });
        await this.router.navigate(['/login']);
        return false;
      } else {
        return true;
      }
    } catch (e) {
      const loggedIn = await this.storage.get('logged_in');
      if (!loggedIn || loggedIn === '' || loggedIn === 'false') {
        await this.router.navigate(['/login']);
      }
      return loggedIn;
    }
  }

}
