import { ApiService } from '../service/api.service';
import { AdminService } from './../service/admin.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private admin: AdminService, private router: Router, private api: ApiService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.api.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/signin']);
    return false;
  }
}