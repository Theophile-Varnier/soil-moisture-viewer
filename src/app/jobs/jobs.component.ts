import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JobsService } from './jobs.service';
import { JobListComponent } from '../job-list/job-list.component';
import { JobTableDto } from '../job-list/job-table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { JobStatus } from '../api-client';
import { MatCardModule } from '@angular/material/card';
import { JobsFiltersComponent } from '../jobs-filters/jobs-filters.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    MatButtonModule,
    JobListComponent,
    JobsFiltersComponent,
    MatMenuModule,
    MatCardModule,
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent {
  jobStatus = JobStatus;

  selectedJobs: JobTableDto[] = [];

  constructor(protected jobsService: JobsService) {}

  protected rerunJobs() {
    this.jobsService.rerunJobs(this.selectedJobs);
  }

  protected updateJobsStatus(status: JobStatus) {
    this.jobsService.setJobsStatus(this.selectedJobs, status);
  }
}
