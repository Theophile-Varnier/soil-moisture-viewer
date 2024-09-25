import { createActionGroup, props } from '@ngrx/store';
import { JobDto, JobStatus } from '../../api-client';

export const JobsFiltersActions = createActionGroup({
  source: 'Jobs filters',
  events: {
    'Select Status': props<{ status: JobStatus }>(),
    'Select Ids': props<{ ids: string[] }>(),
  },
});

export const JobsActions = createActionGroup({
  source: 'Jobs',
  events: {
    'Load Jobs': props<{ jobs: JobDto[] }>(),
    'Load Jobs from page': props<{
      jobs: JobDto[];
      page: number;
      itemsPerPage: number;
      status: JobStatus;
    }>(),
    'Finish loading': props<{ jobs: JobDto[] }>(),
    'Select Job': props<{ id: string }>(),
    'Deselect Job': props<{ id: string }>(),
    'Batch Select Jobs': props<{ ids: string[] }>(),
  },
});
