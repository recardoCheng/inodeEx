import { AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms/src/directives';
import { AdminService } from './../service/admin.service';
import { Router } from '@angular/router';
import { ApiService } from './../service/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isSignouting = false;

  constructor(public api: ApiService,
              public admin: AdminService,
              private router: Router) { }

  ngOnInit() {
    this.api.isAuthenticated();
  }

  onSignout() {
    this.api.saveToken('');
    this.api.isAuthed = false;
    this.api.syncAuthStatus();
    // this.isSignouting = true;
    // this.api.delete('login')
    //   .subscribe(
    //     data => {
    //       console.log(data);
    //       this.isSignouting = false;
    //       this.api.syncAuthStatus();
    //       this.router.navigate(['/signin']);
    //     },
    //     error => {
    //       console.log(error);
    //       this.isSignouting = false;
    //     }
    //   );
  }

}
