import { createSelector } from '@ngrx/store';
import { AppState } from '../state';
import { JobTableDto } from '../../job-list/job-table';
import * as L from 'leaflet';

const jobsSelector = (state: AppState) => state.jobs;

export const jobsTableSelector = createSelector(jobsSelector, (state) =>
  state.jobs.map((job) => new JobTableDto(job))
);

const selectedJobsIdsSelector = (state: AppState) => state.jobs.selectedJobsIds;

export const selectedJobsSelector = createSelector(
  jobsSelector,
  selectedJobsIdsSelector,
  (jobs, selectedIds) => jobs.jobs.filter((job) => selectedIds.includes(job.id))
);

export const geoJsonLayersSelector = createSelector(
  selectedJobsSelector,
  (jobs) => jobs.map((job) => L.geoJSON(job.aoi as any))
);
