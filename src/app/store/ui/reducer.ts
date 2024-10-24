import { createReducer, on } from '@ngrx/store';
import { UiActions } from './actions';
import { JobsActions } from '../jobs/actions';

export interface UiState {
  selectedAggregationId?: string;
  layers: any[];
  loading: boolean;
}

export const initialState: UiState = {
  selectedAggregationId: undefined,
  layers: [],
  loading: false,
};

export const uiReducer = createReducer(
  initialState,
  on(UiActions.selectAggregation, (state, { aggregationId }) => {
    return {
      ...state,
      selectedAggregationId: aggregationId,
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
