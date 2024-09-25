import { Component } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { JobListComponent } from './job-list/job-list.component';
import { AuthComponent } from './auth/auth.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AuthComponent,
    JobListComponent,
    MatTabsModule,
    MatToolbarModule,
    RouterModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  links = ['jobs', 'executions', 'map'];
  activeLink: string;
  title = 'soil-moisture-viewer';
  constructor(private router: Router) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.activeLink = val.url.split('/')[1];
      }
    });
  }
}
