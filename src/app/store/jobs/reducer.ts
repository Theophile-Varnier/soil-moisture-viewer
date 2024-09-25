import { createReducer, on } from '@ngrx/store';
import { JobDto, JobStatus } from '../../api-client';
import { JobsActions, JobsFiltersActions } from './actions';

export interface JobsState {
  statusFilter: JobStatus;
  idsFilter: string[];
  jobs: JobDto[];
  selectedJobsIds: string[];
}

export const initialState: JobsState = {
  statusFilter: JobStatus.Active,
  idsFilter: [],
  jobs: [],
  selectedJobsIds: [],
};

export const jobsReducer = createReducer(
  initialState,
  on(JobsFiltersActions.selectStatus, (state, { status }) => ({
    ...state,
    statusFilter: status,
  })),
  on(JobsFiltersActions.selectIds, (state, { ids }) => ({
    ...state,
    idsFilter: ids,
  })),
  on(JobsActions.loadJobs, (state, { jobs }) => ({
    ...state,
    jobs,
  })),
  on(JobsActions.loadJobsFromPage, (state, { jobs, page }) =>
    page === 1
      ? {
          ...state,
          jobs,
        }
      : {
          ...state,
          jobs: [...state.jobs, ...jobs],
        }
  ),
  on(JobsActions.finishLoading, (state, { jobs }) => ({
    ...state,
    jobs: [...state.jobs, ...jobs],
  })),
  on(JobsActions.selectJob, (state, { id }) => ({
    ...state,
    selectedJobsIds: [...state.selectedJobsIds, id],
  })),
  on(JobsActions.deselectJob, (state, { id }) => ({
    ...state,
    selectedJobsIds: state.selectedJobsIds.filter((jobId) => jobId !== id),
  })),
  on(JobsActions.batchSelectJobs, (state, { ids }) => ({
    ...state,
    selectedJobsIds: [...ids],
  }))
);
