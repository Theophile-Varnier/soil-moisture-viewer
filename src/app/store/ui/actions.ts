import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Aggregation } from '../executions/reducer';

export const UiActions = createActionGroup({
  source: 'UI',
  events: {
    'Select Aggregation': props<{
      aggregation?: Aggregation;
    }>(),
    Refresh: emptyProps(),
    'Set Loading': props<{ loading: boolean }>(),
    'Select File': props<{ file: string }>(),
    'Set Files': props<{ files: Record<string, string[]> }>(),
  },
});
