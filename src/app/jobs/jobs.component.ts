import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { JobListComponent } from '../job-list/job-list.component';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state';
import { CommonModule } from '@angular/common';
import { filteredJobsSelector } from '../store/jobs/selectors';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, JobListComponent, MatCardModule],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  jobs$ = this.store.select(filteredJobsSelector);

  ngOnInit() {}
}
