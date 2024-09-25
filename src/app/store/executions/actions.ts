import { createActionGroup, props } from '@ngrx/store';
import { JobExecutionCreated } from '../../api-client';

export const ExecutionsFiltersActions = createActionGroup({
  source: 'Executions filters',
  events: {
    'Set Filters': props<{
      includeRunning: boolean;
      includeFinished: boolean;
      startDate: Date;
      endDate: Date;
    }>(),
  },
});

export const ExecutionsActions = createActionGroup({
  source: 'Executions',
  events: {
    'Executions Loaded': props<{
      executions: JobExecutionCreated[];
    }>(),
  },
});
