import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { JobBase, JobDto, JobStatus } from '../../api-client';

export const JobsActions = createActionGroup({
  source: 'Jobs',
  events: {
    'Jobs Loaded': props<{ jobs: JobDto[] }>(),
    'Select Job': props<{ id: string }>(),
    'Deselect Job': props<{ id: string }>(),
    'Batch select Jobs': props<{ ids: string[] }>(),
    'Create Jobs': props<{ jobs: JobBase[] }>(),
    'Jobs created': props<{ jobs: JobDto[] }>(),
    'Update Jobs status': props<{ status: JobStatus }>(),
    'Jobs updated': props<{ jobs: JobDto[] }>(),
    'Rerun Jobs': emptyProps(),
  },
});
