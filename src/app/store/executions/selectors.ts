import { createSelector } from '@ngrx/store';
import { AppState } from '../state';
import { areEquals } from '../../helpers';
import { Aggregation } from './reducer';

const executionsSelector = (state: AppState) => state.executions.executions;

export const aggregationsSelector = createSelector(
  executionsSelector,
  (executions) =>
    executions.reduce<Aggregation[]>((acc, execution) => {
      for (const agg of acc) {
        if (areEquals(agg.jobs, execution.jobs)) {
          agg.executions.push(execution);
          return acc;
        }
      }
      acc.push({
        id: execution.id,
        jobs: execution.jobs,
        executions: [execution],
      });
      return acc;
    }, [])
);
