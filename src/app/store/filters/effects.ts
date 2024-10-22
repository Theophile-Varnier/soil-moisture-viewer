import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { FiltersActions } from './actions';
import { map } from 'rxjs';
import { DateTime } from 'luxon';

@Injectable()
export class FiltersEffects {
  constructor(private actions$: Actions) {}

  init = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() =>
        FiltersActions.setExecutionsFilters({
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
}
