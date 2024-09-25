import { Routes } from '@angular/router';
import { JobsComponent } from './jobs/jobs.component';
import { ExecutionsComponent } from './executions/executions.component';
import { MapComponent } from './map/map.component';

export const routes: Routes = [
  { path: 'jobs', component: JobsComponent },
  { path: 'executions', component: ExecutionsComponent },
  { path: 'map', component: MapComponent },
];
