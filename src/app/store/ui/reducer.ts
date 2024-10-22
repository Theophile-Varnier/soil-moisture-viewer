import { createReducer, on } from '@ngrx/store';
import { UiActions } from './actions';
import { JobsActions } from '../jobs/actions';
import { Aggregation } from '../executions/reducer';

export interface UiState {
  selectedAggregation?: Aggregation;
  layers: any[];
}

export const initialState: UiState = {
  selectedAggregation: undefined,
  layers: [],
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
  })
);
