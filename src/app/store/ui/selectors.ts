import { createSelector, Store } from '@ngrx/store';
import { AppState } from '../state';
import { filter, share } from 'rxjs';
import { jobsSelector } from '../jobs/selectors';

const selectedAggregation = (state: AppState) => state.ui.selectedAggregation;

export const selectedAggregationSelector = (store: Store<AppState>) =>
  store.select(selectedAggregation).pipe(
    filter((a) => !!a),
    share()
  );

export const selectedAggregationJobsSelector = createSelector(
  selectedAggregation,
  jobsSelector,
  (aggregation, jobs) =>
    jobs.filter((job) => aggregation?.jobs.includes(job.id))
);
