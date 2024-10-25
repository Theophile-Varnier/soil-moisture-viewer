import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { JobDto } from '../../api-client';

export const UiActions = createActionGroup({
  source: 'UI',
  events: {
    'Select Aggregation': props<{
      aggregationId: string | undefined;
    }>(),
    'Aggregation Jobs Loaded': props<{ jobs: JobDto[] }>(),
    Refresh: emptyProps(),
    'Set Loading': props<{ loading: boolean }>(),
    'Select File': props<{ file: string }>(),
  },
});
