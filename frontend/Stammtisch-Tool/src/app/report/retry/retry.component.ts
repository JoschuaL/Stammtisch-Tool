import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-retry',
    templateUrl: './retry.component.html',
    styleUrls: ['./retry.component.scss'],
})
export class RetryComponent implements OnInit {
    @Input() num: number;
    @Input() retryCallback: () => Promise<void>;
    @Input() online: boolean;
    constructor() {
    }

    ngOnInit() {
    }

}
