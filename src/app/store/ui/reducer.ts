import { createReducer, on } from '@ngrx/store';
import { UiActions } from './actions';
import { Aggregation } from '../executions/reducer';
import { JobsActions } from '../jobs/actions';

export interface UiState {
  selectedAggregation?: Aggregation;
  layers: any[];
  loading: boolean;
}

export const initialState: UiState = {
  selectedAggregation: undefined,
  layers: [],
  loading: false,
};

export const uiReducer = createReducer(
  initialState,
  on(UiActions.selectAggregation, (state, { aggregation }) => {
    return {
      ...state,
      selectedAggregation: aggregation,
    };
  }),
  on(UiActions.aggregationJobsLoaded, (state, { jobs }) => {
    return {
      ...state,
      layers: jobs.map((job) => job.aoi),
    };
  }),
  on(UiActions.setLoading, (state, { loading }) => {
    return {
      ...state,
      loading,
    };
  }),
  on(JobsActions.jobsLoaded, (state, { jobs }) => {
    return {
      ...state,
      loading: false,
    };
  })
);
