import { createActionGroup, props } from '@ngrx/store';
import { JobExecutionCreated } from '../../api-client';

export const ExecutionsActions = createActionGroup({
  source: 'Executions',
  events: {
    'Executions Loaded': props<{
      executions: JobExecutionCreated[];
    }>(),
  },
});
