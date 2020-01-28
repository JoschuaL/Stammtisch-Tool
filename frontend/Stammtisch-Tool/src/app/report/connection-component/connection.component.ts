import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Plugins, PluginListenerHandle, NetworkStatus } from '@capacitor/core';
const { Network } = Plugins;

@Component({
  selector: 'app-connection-component',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
})
export class ConnectionComponent implements OnInit, OnDestroy {
  @Input() additionalText: string;
  @Output() connection = new EventEmitter<boolean>();

  // For displaying the appropriate text
  networkStatus = '';
  // For deciding weather we are actually online or not
  onlineStatus = true;

  private networkListener: PluginListenerHandle;




  constructor(
    private logger: NGXLogger
  ) { }



  ngOnInit() {
    this.networkListener = Network.addListener('networkStatusChange',
      (status) => {
        this.logger.debug('Network status changes', status);
        this.networkStatus = this.mapConnectionToStatus(status);
        this.onlineStatus = status.connected;
        this.connection.emit(this.onlineStatus);
      }
    );
    this.initializeNetworkStatus();
  }


  /**
   * Sets the fields to the correct values from the NetworkStatus
   */
  async initializeNetworkStatus(): Promise<void> {
    const status = await Network.getStatus();
    this.networkStatus = this.mapConnectionToStatus(status);
    this.onlineStatus = status.connected;
    this.connection.emit(this.onlineStatus);
  }


  /**
   * To display appropriate messages for the online status
   * @param status Our Network Status
   * @return 'Online' if we're online, 'Offline' otherwise
   */
  mapConnectionToStatus(status: NetworkStatus): string {
    return status.connected ? 'Online' : 'Offline';
  }

  ngOnDestroy(): void {
    this.networkListener.remove();
  }

}
