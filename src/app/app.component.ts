import { Component } from '@angular/core';
import { AdminService } from './service/admin.service';
import { ApiService } from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  constructor(public api: ApiService, public admin: AdminService) { }
}
