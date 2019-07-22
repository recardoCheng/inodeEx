import { AdminService } from './service/admin.service';
import { ApiService } from './service/api.service';
import { HeaderComponent } from './header/header.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SigninComponent } from './auth/signin/signin.component';
import { AppRoutingModule } from './app-routing.modue';
import { AuthGuard } from './auth/auth-guard.service';
import { MainComponent } from './main/main.component';
import { TabsModule, AlertModule } from 'ngx-bootstrap';
import { CookieModule } from 'ngx-cookie';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    HeaderComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    TabsModule.forRoot(),
    AlertModule.forRoot(),
    CookieModule.forRoot()
  ],
  providers: [
    ApiService,
    AuthGuard,
    AdminService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
