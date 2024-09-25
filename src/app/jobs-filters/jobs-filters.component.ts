import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state';
import { JobsFiltersActions } from '../store/jobs/actions';
import { JobStatus } from '../api-client';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-jobs-filters',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './jobs-filters.component.html',
  styleUrl: './jobs-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsFiltersComponent {
  statuses = [JobStatus.Active, JobStatus.Inactive, JobStatus.Running];
  protected ids: string = '';
  status$ = this.store.select((state) => state.jobs.statusFilter);
  idRegex = new RegExp(
    '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
    'g'
  );

  constructor(private store: Store<AppState>) {}

  setStatus(status: MatSelectChange) {
    this.store.dispatch(
      JobsFiltersActions.selectStatus({
        status: status.value,
      })
    );
  }

  protected parseInput() {
    const ids = this.ids.match(this.idRegex) ?? [];
    this.store.dispatch(JobsFiltersActions.selectIds({ ids }));
  }
}
