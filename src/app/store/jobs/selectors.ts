import { createSelector } from '@ngrx/store';
import { AppState } from '../state';
import { displayedExecutionsSelector } from '../executions/selectors';

export const jobsSelector = (state: AppState) => state.jobs.jobs;

const selectedJobsIdsSelector = (state: AppState) => state.jobs.selectedJobsIds;

const jobStatusFilterSelector = (state: AppState) => state.filters.ui.status;
const jobIdsFilterSelector = (state: AppState) => state.filters.ui.ids;

export const filteredJobsSelector = createSelector(
  jobsSelector,
  jobStatusFilterSelector,
  jobIdsFilterSelector,
  displayedExecutionsSelector,
  (jobs, statusFilter, idsFilter, executions) =>
    jobs.filter(
      (job) =>
        statusFilter.includes(job.status) &&
        (!idsFilter.length || idsFilter.includes(job.id)) &&
        executions.some((execution) => execution.jobs.includes(job.id))
    )
);

export const selectedJobsSelector = createSelector(
  jobsSelector,
  selectedJobsIdsSelector,
  (jobs, selectedIds) => jobs.filter((job) => selectedIds.includes(job.id))
);
