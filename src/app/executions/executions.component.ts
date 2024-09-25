import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { ExecutionsListComponent } from '../executions-list/executions-list.component';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state';
import { ExecutionsFiltersActions } from '../store/executions/actions';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-executions',
  standalone: true,
  imports: [
    CommonModule,
    ExecutionsListComponent,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    MatDatepickerModule,
    MatCardModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './executions.component.html',
  styleUrl: './executions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExecutionsComponent {
  displayedColumns: string[] = [
    'id',
    'productType',
    'executionStartDate',
    'executionEndDate',
    'startDate',
    'endDate',
    'result',
    'rerun',
    'jobs',
  ];

  executions$ = this.store.select((state) => state.executions.executions);
  filters$ = this.store.select((state) => state.executions.filters);
  startDate: Date;
  constructor(private store: Store<AppState>) {}

  isDisabled(thisOne: boolean, thatOne: boolean) {
    return thisOne && !thatOne;
  }

  toggleIncludeFinished(includeFinished: boolean, filters: any) {
    this.store.dispatch(
      ExecutionsFiltersActions.setFilters({ ...filters, includeFinished })
    );
  }

  toggleIncludeRunning(includeRunning: boolean, filters: any) {
    this.store.dispatch(
      ExecutionsFiltersActions.setFilters({ ...filters, includeRunning })
    );
  }

  setStartDate(startDate: any) {
    this.startDate = startDate;
  }

  setEndDate(endDate: any, filters: any) {
    if (endDate) {
      this.store.dispatch(
        ExecutionsFiltersActions.setFilters({
          ...filters,
          startDate: this.startDate,
          endDate,
        })
      );
    }
  }
}
