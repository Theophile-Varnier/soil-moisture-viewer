import { createReducer, on } from '@ngrx/store';
import { UiActions } from './actions';

export interface UiState {
  selectedAggregations: string[];
}

export const initialState: UiState = {
  selectedAggregations: [],
};

export const uiReducer = createReducer(
  initialState,
  on(UiActions.toggleAggregation, (state, { id }) => {
    return {
      ...state,
      selectedAggregations: state.selectedAggregations.includes(id)
        ? state.selectedAggregations.filter((aggId) => aggId !== id)
        : [...state.selectedAggregations, id],
    };
  })
);
