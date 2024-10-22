import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../state';
import { ExecutionsActions } from './actions';
import { combineLatest, map, mergeMap, withLatestFrom } from 'rxjs';
import { DateTime } from 'luxon';
import { authenticatedUserSelector } from '../auth/selectors';
import { RunsService } from '../../api-client';
import { UiActions } from '../ui/actions';
import { FiltersActions } from '../filters/actions';

@Injectable()
export class ExecutionsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private runsService: RunsService
  ) {}

  fetchExecutions = createEffect(() =>
    combineLatest([
      this.actions$.pipe(
        ofType(FiltersActions.setExecutionsFilters, UiActions.refresh)
      ),
      authenticatedUserSelector(this.store),
    ]).pipe(
      withLatestFrom(this.store.select((state) => state.filters.executions)),
      mergeMap(([action, filters]) =>
        this.runsService.getRunsRunsGet(
          undefined,
          filters.includeRunning && filters.includeFinished
            ? undefined
            : filters.includeFinished,
          DateTime.fromJSDate(filters.startDate).toISODate()!,
          DateTime.fromJSDate(filters.endDate).plus({ days: 1 }).toISODate()!
        )
      ),
      map((executions) => ExecutionsActions.executionsLoaded({ executions }))
    )
  );
}
