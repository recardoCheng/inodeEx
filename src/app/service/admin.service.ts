import { Http } from '@angular/http';
import { Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Rx';

import { AlertModel } from './../shared/alert.model';

@Injectable()
export class AdminService {

  // 訂閱通知
  // businessesChanged = new Subject<Business[]>();

  // UI
  alerts: AlertModel[] = [];

  constructor (private api: ApiService, private router: Router, private http: Http) {
    this.init();
  }

  // ngOnInit 只有在 Component 與 Directive 會發生作用
  // [ref] https://stackoverflow.com/a/35110798/1702774
  // ngOnInit() {}

  init () {
    this.api.syncAuthStatus();
  }


  // getBusinesses() {
  //   this.api.getBusinesses(userId).subscribe(
  //     result => {
  //       this.businesses = result.data;
  //       console.log('admin > getBusinesses done', this.businesses);
  //       this.businessesChanged.next(this.businesses.slice());
  //     },
  //     error => {
  //       console.error('admin > getBusinesses error', error);
  //     }
  //   );
  // }

  // ------- utilities ------

  addAlert(alert: AlertModel) {
    this.alerts.push(alert);
  }
  errorAlert(msg: string) {
    this.addAlert({
      type: 'danger',
      timeout: 3000,
      msg: msg
    });
  }
  successAlert(msg: string) {
    console.log('successAlert', msg);
    this.addAlert({
      type: 'success',
      timeout: 3000,
      msg: msg
    });
  }


}