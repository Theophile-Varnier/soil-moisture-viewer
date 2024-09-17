import { Component } from '@angular/core';
import { JobsService } from './jobs.service';
import { JobListComponent } from '../job-list/job-list.component';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { JobTableDto } from '../job-list/job-table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { JobStatus } from '../api-client';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    MatSelectModule,
    MatButtonModule,
    JobListComponent,
    MatInputModule,
    MatMenuModule,
    FormsModule,
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
})
export class JobsComponent {
  jobStatus = JobStatus;
  statuses = ['Active', 'Inactive', 'Running'];

  idRegex = new RegExp(
    '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
    'g'
  );

  protected ids: string = '';

  selectedJobs: JobTableDto[] = [];

  constructor(protected jobsService: JobsService) {}

  ngOnInit() {
    this.jobsService.setCurrentStatus(this.statuses[0]);
  }

  protected setStatus(status: MatSelectChange) {
    const statusName = status.value;
    this.jobsService.setCurrentStatus(statusName);
  }

  protected parseInput() {
    this.jobsService.setJobsId(this.ids.match(this.idRegex) ?? []);
  }

  protected rerunJobs() {
    this.jobsService.rerunJobs(this.selectedJobs);
    this.selectedJobs = [];
  }

  protected updateJobsStatus(status: JobStatus) {
    this.jobsService.setJobsStatus(this.selectedJobs, status);
    this.selectedJobs = [];
  }
}
