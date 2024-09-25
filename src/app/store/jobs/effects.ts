import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { JobsActions, JobsFiltersActions } from './actions';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../state';
import {
  combineLatest,
  concat,
  finalize,
  from,
  map,
  mergeMap,
  switchMap,
  toArray,
} from 'rxjs';
import { JobsService, JobStatus } from '../../api-client';
import { authenticatedUserSelector } from '../auth/selectors';

@Injectable()
export class JobsEffects {
  private ITEMS_PER_PAGE = 2;

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private jobsService: JobsService
  ) {}

  init = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => JobsFiltersActions.selectStatus({ status: JobStatus.Active }))
    )
  );

  queryJobsFromIds = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(JobsFiltersActions.selectIds)),
      authenticatedUserSelector(this.store),
    ]).pipe(
      switchMap(([action, user]) =>
        concat(
          from(action.ids).pipe(
            mergeMap((id) =>
              this.jobsService
                .getJobDetailJobsJobIdGet(id)
                .pipe(finalize(() => console.log('job loaded')))
            )
          )
        ).pipe(
          toArray(),
          map((jobs) =>
            JobsActions.loadJobs({
              jobs,
            })
          )
        )
      )
    )
  );

  queryJobsFromFilters = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(JobsFiltersActions.selectStatus)),
      authenticatedUserSelector(this.store),
    ]).pipe(
      switchMap(([action, user]) =>
        this.jobsService
          .getJobListJobsGet(
            undefined,
            action.status,
            undefined,
            1,
            this.ITEMS_PER_PAGE
          )
          .pipe(
            map((jobs) =>
              jobs.length === this.ITEMS_PER_PAGE
                ? JobsActions.loadJobsFromPage({
                    jobs,
                    page: 1,
                    itemsPerPage: this.ITEMS_PER_PAGE,
                    status: action.status,
                  })
                : JobsActions.loadJobs({ jobs })
            )
          )
      )
    )
  );
  queryJobsNextPage = createEffect(() =>
    this.actions$.pipe(
      ofType(JobsActions.loadJobsFromPage),
      concatLatestFrom((action) => authenticatedUserSelector(this.store)),
      switchMap(([action, status]) =>
        this.jobsService
          .getJobListJobsGet(
            undefined,
            action.status,
            undefined,
            action.page + 1,
            action.itemsPerPage
          )
          .pipe(
            map((jobs) =>
              jobs.length === action.itemsPerPage
                ? JobsActions.loadJobsFromPage({
                    jobs,
                    page: action.page + 1,
                    itemsPerPage: action.itemsPerPage,
                    status: action.status,
                  })
                : JobsActions.finishLoading({ jobs })
            )
          )
      )
    )
  );
}
