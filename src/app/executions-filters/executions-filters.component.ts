import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { map, Observable } from 'rxjs';
import { FiltersActions } from '../store/filters/actions';
import {
  ExecutionsFiltersState,
  UiFiltersState,
} from '../store/filters/reducer';

@Component({
  selector: 'app-executions-filters',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './executions-filters.component.html',
  styleUrl: './executions-filters.component.scss',
})
export class ExecutionsFiltersComponent {
  filters$ = this.store.select((state) => state.filters);
  startDate: Date;
  includedExecutions$: Observable<string[]> = this.filters$.pipe(
    map((filters) => {
      let res = [];
      if (filters.executions.includeRunning) {
        res.push('Running');
      }
      if (filters.executions.includeFinished) {
        res.push('Finished');
      }
      return res;
    })
  );
  constructor(private store: Store<AppState>) {}

  isDisabled(thisOne: boolean, thatOne: boolean) {
    return thisOne && !thatOne;
  }

  setExecutionsFilters(event: MatButtonToggleChange, filters: any) {
    this.store.dispatch(
      FiltersActions.setExecutionsFilters({
        ...filters,
        includeFinished: event.value.includes('Finished'),
        includeRunning: event.value.includes('Running'),
      })
    );
  }

  setStartDate(startDate: any) {
    this.startDate = startDate;
  }

  setEndDate(endDate: any, filters: ExecutionsFiltersState) {
    if (endDate) {
      this.store.dispatch(
        FiltersActions.setExecutionsFilters({
          ...filters,
          startDate: this.startDate,
          endDate,
        })
      );
    }
  }

  setError(event: Event, filters: UiFiltersState) {
    const error = (event.target as HTMLInputElement).value;
    this.store.dispatch(FiltersActions.setUiFilters({ ...filters, error }));
  }
}
