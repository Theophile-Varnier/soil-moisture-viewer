import { Routes } from '@angular/router';
import { JobsComponent } from './jobs/jobs.component';
import { ExecutionsComponent } from './executions/executions.component';

export const routes: Routes = [
  { path: 'jobs', component: JobsComponent },
  { path: 'executions', component: ExecutionsComponent },
];
