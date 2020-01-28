import { Component, OnInit } from '@angular/core';
import {Report} from '../report/report';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  constructor(
    private storage: Storage
  ) { }

  // To avoid NULL
  SelectedReport: Report = null;
  // To avoid NULL
  nop = async () => { };


  ngOnInit() {
    this.storage.get('edit_report').then(
      ret => {
        this.SelectedReport = ret;
      }
    );
  }





}
