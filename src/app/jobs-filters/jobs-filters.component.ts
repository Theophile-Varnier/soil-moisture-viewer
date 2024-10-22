import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state';
import { JobStatus } from '../api-client';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { FiltersActions } from '../store/filters/actions';
import { UiFiltersState } from '../store/filters/reducer';

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
  filters$ = this.store
    .select((state) => state.filters.ui)
    .pipe(tap((s) => (this.selectedStatus = s.status)));
  selectedStatus: JobStatus[] = [];
  idRegex = new RegExp(
    '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
    'g'
  );

  constructor(private store: Store<AppState>) {}

  setStatus(status: MatSelectChange, filters: UiFiltersState) {
    this.store.dispatch(
      FiltersActions.setUiFilters({
        ...filters,
        status: this.selectedStatus,
      })
    );
  }

  protected parseInput(filters: UiFiltersState) {
    const ids = this.ids.match(this.idRegex) ?? [];
    this.store.dispatch(FiltersActions.setUiFilters({ ...filters, ids }));
  }
}
