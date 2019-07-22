import { AdminService } from './../../service/admin.service';
import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { NgForm } from '@angular/forms/src/directives';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  isSignining = false;

  constructor(public api: ApiService, private admin: AdminService, private router: Router) { }

  ngOnInit() {
  }

  onSignin(form: NgForm) {
    const params = {
      account: form.value.username,
      password: form.value.password
    };
    this.isSignining = true;
    this.api.post('signin', params)
      .subscribe(
        data => {
          console.log(data);
          this.isSignining = false;
          this.api.saveToken(data.token);
          this.api.syncAuthStatus();
          this.router.navigate(['/']);
        },
        error => {
          console.error(error);
          this.isSignining = false;
          this.api.isAuthed = false;
          this.admin.errorAlert(error);
        }
      );
  }

}
