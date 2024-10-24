import { createSelector, Store } from '@ngrx/store';
import { AppState } from '../state';
import { filter, share } from 'rxjs';
import { jobsSelector } from '../jobs/selectors';
import { aggregationsSelector } from '../executions/selectors';

const selectedAggregationId = (state: AppState) =>
  state.ui.selectedAggregationId;

export const selectedAggregation = createSelector(
  selectedAggregationId,
  aggregationsSelector,
  (id, aggregations) => {
    return aggregations.find((a) => a.id === id);
  }
);

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
