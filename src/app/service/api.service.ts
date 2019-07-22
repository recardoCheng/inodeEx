import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import 'rxjs/Rx';

@Injectable()
export class ApiService {
  isAuthSynced = false;
  isAuthed = false;
  token = '';

  // ng serve 時要用這個去呼叫 api（server servcie 要先在 local 跑起來）
  url = 'https://localhost:3000/api/';
  // 進行 ng build 時，要切換成下面這個連結，才能把 dist 版本複製到 server app 的 public folder
  // url = '/api/';

  constructor(private http: Http, private router: Router, private cookie: CookieService) {}

  parseErrorResponse(error: Response) {
    let msg = '';
    const errorJson = error.json();
    if (errorJson && errorJson.error && errorJson.error.message) {
      msg = errorJson.error.message;
    } else if (typeof errorJson === 'string') {
      msg = errorJson;
    } else {
      msg = error.toString();
    }

    return msg;
  }

  post(api: string, params?: any) {
    const headers = new Headers({
      'Content-Type': 'application/json',   // default
      'token': this.token,
    });
    // return this.http.post(this.url + api, params);
    return this.http.post(this.url + api, params, {
        headers: headers
        // withCredentials: true  // 後端使用 session + cookie 認證，所以要加上這個
      })
      .map(
        (response: Response) => {
          const data = response.json();
          if (data.result) {
            return data.result;
          } else {
            return data;
          }
        }
      )
      .catch(
        (error: Response) => {
          if (error.status === 401) {
            console.error(error);
            this.isAuthed = false;
            this.saveToken('');
            this.router.navigate(['/signin']);
          }
          return Observable.throw(this.parseErrorResponse(error));
        }
      );
  }

  put(api: string, params?: any) {
    const headers = new Headers({
      'Content-Type': 'application/json',   // default
      'token': this.token,
    });
    // return this.http.post(this.url + api, params);
    return this.http.put(this.url + api, params, {
        headers: headers
      })
      .map(
        (response: Response) => {
          const data = response.json();
          if (data.result) {
            return data.result;
          } else {
            return data;
          }
        }
      )
      .catch(
        (error: Response) => {
          if (error.status === 401) {
            console.error(error);
            this.isAuthed = false;
            this.saveToken('');
            this.router.navigate(['/signin']);
          }
          return Observable.throw(this.parseErrorResponse(error));
        }
      );
  }

  get(api: string) {
    const headers = new Headers({
      'Content-Type': 'application/json',   // default
      'token': this.token,
    });
    return this.http.get(this.url + api, {
        headers: headers
      })
      .map(
        (response: Response) => {
          const data = response.json();
          if (data.result) {
            return data.result;
          } else {
            return data;
          }
        }
      )
      .catch(
        (error: Response) => {
          if (error.status === 401) {
            console.error(error);
            this.isAuthed = false;
            this.saveToken('');
            this.router.navigate(['/signin']);
          }
          return Observable.throw(this.parseErrorResponse(error));
        }
      );
  }

  saveToken(token) {
    this.token = token;
    this.cookie.put('token', token);
    console.log('[api] saveToken', this.token);
  }

  loadToken() {
    this.token = this.cookie.get('token');
    console.log('[api] loadToken', this.token);
    return this.token;
  }

  syncAuthStatus() {
    console.log('admin > syncAuthStatus...');

    // test
    // this.isAuthSynced = true;
    // this.api.isAuthed = true;
    // this.router.navigate(['/']);

    this.loadToken();

    if (this.token) {
      this.isAuthSynced = true;
      this.isAuthed = true;
    }

    this.get('signin').subscribe(
      result => {
        this.isAuthSynced = true;
        this.isAuthed = result.authed;
        console.log('admin > syncAuthStatus', this.isAuthed, this.router.routerState.snapshot.url);
        if (this.isAuthed && this.router.routerState.snapshot.url === '/signin') {
          this.router.navigate(['/']);
        }
      },
      error => {
        console.error('admin > syncAuthStatus error', error);
        this.isAuthSynced = true;
        this.isAuthed = false;
        this.saveToken('');
        this.router.navigate(['/signin']);
      }
    );
  }

  isAuthenticated() {
    return this.isAuthed;
  }

  // getBusinesses(uid) {
  //   return this.get('accounts/' + uid + '/businesses');
  // }

  getConfig() {
    return this.get('configuration');
  }

  setConfig(config) {
    return this.post('configuration', config);
  }

}
