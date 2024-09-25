import { createActionGroup, props } from '@ngrx/store';

export const UiActions = createActionGroup({
  source: 'UI',
  events: {
    'Toggle Aggregation': props<{
      id: string;
    }>(),
  },
});
