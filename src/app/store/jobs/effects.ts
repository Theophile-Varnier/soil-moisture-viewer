import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { JobsActions } from './actions';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../state';
import { concat, from, map, mergeMap, switchMap, toArray } from 'rxjs';
import { JobsService } from '../../api-client';
import { authenticatedUserSelector } from '../auth/selectors';
import { ExecutionsActions } from '../executions/actions';

@Injectable()
export class JobsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private jobsService: JobsService
  ) {}

  loadJobs = createEffect(() =>
    this.actions$.pipe(
      ofType(ExecutionsActions.executionsLoaded),
      switchMap((executions) => {
        const ids = [...new Set(executions.executions.flatMap((e) => e.jobs))];
        return this.jobsService.getJobListJobsQueryPost(ids);
      }),
      map((jobs) => JobsActions.jobsLoaded({ jobs }))
    )
  );

  createJobs = createEffect(() =>
    this.actions$.pipe(
      ofType(JobsActions.createJobs),
      concatLatestFrom((action) => authenticatedUserSelector(this.store)),
      switchMap(([action, user]) =>
        // keep this in case we want to create them sequentially
        // concat(
        //   ...action.jobs.map((job) => this.jobsService.createJobJobsPost(job))
        // ).pipe(toArray())
        from(action.jobs).pipe(
          mergeMap((job) => this.jobsService.createJobJobsPost(job)),
          toArray()
        )
      ),
      map((jobs) => JobsActions.jobsCreated({ jobs }))
    )
  );

  updateJobsStatus = createEffect(() =>
    this.actions$.pipe(
      ofType(JobsActions.updateJobsStatus),
      concatLatestFrom((action) => authenticatedUserSelector(this.store)),
      concatLatestFrom((action) =>
        this.store.select((state) => state.jobs.selectedJobsIds)
      ),
      switchMap((args) =>
        concat(
          from(args[1]).pipe(
            mergeMap((id) =>
              this.jobsService.updateJobJobsJobIdPatch(id, {
                status: args[0][0].status,
              })
            )
          )
        ).pipe(toArray())
      ),
      map((jobs) => JobsActions.jobsUpdated({ jobs }))
    )
  );

  rerunJobs = createEffect(() =>
    this.actions$.pipe(
      ofType(JobsActions.rerunJobs),
      concatLatestFrom((action) => authenticatedUserSelector(this.store)),
      concatLatestFrom((action) =>
        this.store.select((state) => state.jobs.selectedJobsIds)
      ),
      switchMap((args) => this.jobsService.rerunJobsJobsRerunPost(args[1])),
      map((jobs) => JobsActions.jobsUpdated({ jobs: [] }))
    )
  );
}
