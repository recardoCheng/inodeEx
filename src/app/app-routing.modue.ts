import { AuthGuard } from './auth/auth-guard.service';
import { SigninComponent } from './auth/signin/signin.component';
import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  // { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: MainComponent, canActivate: [AuthGuard] },

  // auth
  { path: 'signin', component: SigninComponent }
];


@NgModule ({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}