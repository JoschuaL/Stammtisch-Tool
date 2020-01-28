import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import {
  Plugins,
  StatusBarStyle,
} from '@capacitor/core';
const { SplashScreen } = Plugins;
const { StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private logger: NGXLogger
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      StatusBar.setStyle({ style: prefersDark.matches ? StatusBarStyle.Dark : StatusBarStyle.Light }).catch(e => this.logger.error(e));
      SplashScreen.hide().catch(e => this.logger.error(e));
    });
  }
}
