import { JobExecutionCreated } from '../../api-client';
import { createReducer, on } from '@ngrx/store';
import { ExecutionsActions } from './actions';
import { DateTime } from 'luxon';
import { UiActions } from '../ui/actions';
import { FiltersActions } from '../filters/actions';

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
  })),
  on(UiActions.refresh, FiltersActions.setExecutionsFilters, (state) => ({
    ...state,
    executions: [],
  }))
);
