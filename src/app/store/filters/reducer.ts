import { createReducer, on } from '@ngrx/store';
import { JobStatus } from '../../api-client';
import { FiltersActions } from './actions';

export interface ExecutionsFiltersState {
  includeRunning: boolean;
  includeFinished: boolean;
  startDate: Date;
  endDate: Date;
}

export interface ResultFiltersState {
  includeSuccess: boolean;
  includeError: boolean;
}

export interface UiFiltersState {
  error: string;
  status: JobStatus[];
  ids: string[];
}

export interface AppFiltersState {
  ui: UiFiltersState;
  executions: ExecutionsFiltersState;
  result: ResultFiltersState;
}

export const initialState: AppFiltersState = {
  ui: {
    status: [JobStatus.Active, JobStatus.Inactive, JobStatus.Running],
    ids: [],
    error: '',
  },
  executions: {
    includeRunning: true,
    includeFinished: true,
    startDate: new Date(),
    endDate: new Date(),
  },
  result: {
    includeError: true,
    includeSuccess: true,
  },
};

export const filtersReducer = createReducer(
  initialState,
  on(FiltersActions.setExecutionsFilters, (state, filters) => ({
    ...state,
    executions: { ...filters },
  })),
  on(FiltersActions.setUiFilters, (state, filters) => ({
    ...state,
    ui: { ...filters },
  })),
  on(FiltersActions.setResultFilters, (state, filters) => ({
    ...state,
    result: { ...filters },
  }))
);
