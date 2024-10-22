import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Aggregation } from '../executions/reducer';
import { JobDto } from '../../api-client';

export const UiActions = createActionGroup({
  source: 'UI',
  events: {
    'Select Aggregation': props<{
      aggregation: Aggregation | undefined;
    }>(),
    'Aggregation Jobs Loaded': props<{ jobs: JobDto[] }>(),
    Refresh: emptyProps(),
    'Set Loading': props<{ loading: boolean }>(),
  },
});
