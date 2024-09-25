import { JobExecutionCreated } from '../../api-client';
import { createReducer, on } from '@ngrx/store';
import { ExecutionsActions, ExecutionsFiltersActions } from './actions';

export interface Aggregation {
  id: string;
  jobs: string[];
  executions: JobExecutionCreated[];
}

export interface ExecutionsState {
  filters: {
    includeRunning: boolean;
    includeFinished: boolean;
    startDate: Date;
    endDate: Date;
  };
  executions: JobExecutionCreated[];
}

export const initialState: ExecutionsState = {
  filters: {
    includeRunning: true,
    includeFinished: false,
    startDate: new Date(),
    endDate: new Date(),
  },
  executions: [],
};

export const executionsReducer = createReducer(
  initialState,
  on(
    ExecutionsFiltersActions.setFilters,
    (state, { includeRunning, includeFinished, startDate, endDate }) => ({
      ...state,
      filters: {
        includeRunning,
        includeFinished,
        startDate,
        endDate,
      },
    })
  ),
  on(ExecutionsActions.executionsLoaded, (state, { executions }) => ({
    ...state,
    executions,
  }))
);
