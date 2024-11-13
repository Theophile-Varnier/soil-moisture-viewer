import { Injectable } from '@angular/core';
import { AppState } from '../state';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UiActions } from './actions';
import { combineLatest, map, mergeMap, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { FiltersActions } from '../filters/actions';
import { authenticatedUserSelector } from '../auth/selectors';
import { JobsService } from '../../api-client';

@Injectable()
export class UiEffects {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private service: JobsService
  ) {}

  toggleLoading = createEffect(() =>
    combineLatest([
      this.actions$.pipe(
        ofType(FiltersActions.setExecutionsFilters, UiActions.refresh)
      ),
      authenticatedUserSelector(this.store),
    ]).pipe(map(() => UiActions.setLoading({ loading: true })))
  );

  loadFiles = createEffect(() =>
    this.actions$.pipe(
      ofType(UiActions.selectAggregation),
      mergeMap((action) =>
        action.aggregation
          ? this.service.getJobFilesJobsFilesPost(action.aggregation?.jobs)
          : of([])
      ),
      map((files) => UiActions.setFiles({ files: files as any }))
    )
  );
}
