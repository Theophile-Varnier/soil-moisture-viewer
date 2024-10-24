import { Injectable } from '@angular/core';
import { AppState } from '../state';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UiActions } from './actions';
import {
  combineLatest,
  forkJoin,
  map,
  mergeMap,
  of,
  withLatestFrom,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { JobsService } from '../../api-client';
import { FiltersActions } from '../filters/actions';
import { authenticatedUserSelector } from '../auth/selectors';
import { selectedAggregation } from './selectors';

@Injectable()
export class UiEffects {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private jobsService: JobsService
  ) {}

  toggleLoading = createEffect(() =>
    combineLatest([
      this.actions$.pipe(
        ofType(FiltersActions.setExecutionsFilters, UiActions.refresh)
      ),
      authenticatedUserSelector(this.store),
    ]).pipe(map(() => UiActions.setLoading({ loading: true })))
  );

  loadAggregationsJobs = createEffect(() =>
    this.actions$.pipe(
      ofType(UiActions.selectAggregation),
      withLatestFrom(
        this.store.select((st) => st.jobs.jobs),
        this.store.select(selectedAggregation)
      ),
      mergeMap(([action, jobs, aggregation]) => {
        let jobsIds: string[] = aggregation ? aggregation.jobs : [];
        return jobsIds.length
          ? forkJoin(
              jobsIds.map((id) => {
                const existingJob = jobs.find((job) => job.id === id);
                if (existingJob) {
                  return of(existingJob);
                }
                return this.jobsService.getJobDetailJobsJobIdGet(id);
              })
            )
          : of([]);
      }),
      map((jobs) => {
        return UiActions.aggregationJobsLoaded({ jobs });
      })
    )
  );
}
