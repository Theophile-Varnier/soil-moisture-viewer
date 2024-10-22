import { Injectable } from '@angular/core';
import { AppState } from '../state';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UiActions } from './actions';
import { forkJoin, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { JobsService } from '../../api-client';

@Injectable()
export class UiEffects {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private jobsService: JobsService
  ) {}

  loadAggregationsJobs = createEffect(() =>
    this.actions$.pipe(
      ofType(UiActions.selectAggregation),
      withLatestFrom(this.store.select((st) => st.jobs.jobs)),
      mergeMap(([action, jobs]) => {
        let jobsIds: string[] = action.aggregation
          ? action.aggregation.jobs
          : [];
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
