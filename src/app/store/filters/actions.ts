import { createActionGroup, props } from '@ngrx/store';
import { ExecutionsFiltersState, UiFiltersState } from './reducer';

export const FiltersActions = createActionGroup({
  source: 'Filters',
  events: {
    'Set Executions Filters': props<ExecutionsFiltersState>(),
    'Set Ui Filters': props<UiFiltersState>(),
  },
});
