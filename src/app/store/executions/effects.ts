import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../state';
import { ExecutionsActions, ExecutionsFiltersActions } from './actions';
import { combineLatest, map, mergeMap } from 'rxjs';
import { DateTime } from 'luxon';
import { authenticatedUserSelector } from '../auth/selectors';
import { RunsService } from '../../api-client';

@Injectable()
export class ExecutionsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private runsService: RunsService
  ) {}

  init = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() =>
        ExecutionsFiltersActions.setFilters({
          includeFinished: true,
          includeRunning: true,
          startDate: DateTime.now()
            .startOf('day')
            .minus({ weeks: 1 })
            .toJSDate(),
          endDate: DateTime.now().startOf('day').toJSDate(),
        })
      )
    )
  );

  fetchExecutions = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(ExecutionsFiltersActions.setFilters)),
      authenticatedUserSelector(this.store),
    ]).pipe(
      mergeMap(([action, user]) =>
        this.runsService.getRunsRunsGet(
          undefined,
          action.includeRunning && action.includeFinished
            ? undefined
            : action.includeFinished,
          DateTime.fromJSDate(action.startDate).toISODate()!,
          DateTime.fromJSDate(action.endDate).plus({ days: 1 }).toISODate()!
        )
      ),
      map((executions) => ExecutionsActions.executionsLoaded({ executions }))
    )
  );
}
