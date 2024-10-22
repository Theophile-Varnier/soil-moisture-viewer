import { JobExecutionCreated } from '../../api-client';
import { createReducer, on } from '@ngrx/store';
import { ExecutionsActions } from './actions';
import { DateTime } from 'luxon';

export interface Aggregation {
  id: string;
  jobs: string[];
  executions: JobExecutionCreated[];
  start: DateTime;
  end: DateTime;
  name?: string;
  geoLocation?: string;
}

export interface ExecutionsState {
  executions: JobExecutionCreated[];
}

export const initialState: ExecutionsState = {
  executions: [],
};

export const executionsReducer = createReducer(
  initialState,
  on(ExecutionsActions.executionsLoaded, (state, { executions }) => ({
    ...state,
    executions,
  }))
);
