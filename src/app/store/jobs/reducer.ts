import { createReducer, on } from '@ngrx/store';
import { JobDto } from '../../api-client';
import { JobsActions } from './actions';
import { UiActions } from '../ui/actions';
import { FiltersActions } from '../filters/actions';

export interface JobsState {
  jobs: JobDto[];
  selectedJobsIds: string[];
}

export const initialState: JobsState = {
  jobs: [],
  selectedJobsIds: [],
};

export const jobsReducer = createReducer(
  initialState,
  on(JobsActions.jobsLoaded, (state, { jobs }) => ({
    ...state,
    jobs,
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
  })),
  on(JobsActions.jobsCreated, (state, { jobs }) => ({
    ...state,
    jobs: [...jobs, ...state.jobs],
  })),
  on(JobsActions.jobsUpdated, (state, { jobs }) => ({
    ...state,
    selectedJobsIds: [],
    jobs: state.jobs.map((job) => {
      const updatedJob = jobs.find((j) => j.id === job.id);
      return updatedJob ? updatedJob : job;
    }),
  })),
  on(UiActions.refresh, FiltersActions.setExecutionsFilters, (state) => ({
    ...initialState,
  }))
);
