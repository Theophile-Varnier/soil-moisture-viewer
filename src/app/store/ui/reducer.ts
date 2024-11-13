import { createReducer, on } from '@ngrx/store';
import { UiActions } from './actions';
import { JobsActions } from '../jobs/actions';

export interface UiState {
  selectedAggregationId?: string;
  loading: boolean;
  selectedFile?: string;
  files: Record<string, string[]>;
}

export interface Tree {
  name: string;
  id: string;
  children: Tree[];
}

export const initialState: UiState = {
  selectedAggregationId: undefined,
  loading: false,
  files: {},
};

export const uiReducer = createReducer(
  initialState,
  on(UiActions.selectAggregation, (state, { aggregation }) => {
    return {
      ...state,
      selectedAggregationId: aggregation?.id,
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
  }),
  on(UiActions.setFiles, (state, { files }) => {
    return {
      ...state,
      files,
    };
  }),
  on(UiActions.selectFile, (state, { file }) => {
    return {
      ...state,
      selectedFile: file,
    };
  })
);
