import { createSelector, Store } from '@ngrx/store';
import { AppState } from '../state';
import { filter, share } from 'rxjs';
import { jobsSelector } from '../jobs/selectors';
import { aggregationsSelector } from '../executions/selectors';
import { Tree } from './reducer';
import { DateTime } from 'luxon';

const yearRegex = new RegExp('([0-9]{4})([0-9]{4})?.tif');

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
    jobs.filter((job) => !aggregation || aggregation.jobs.includes(job.id))
);

export const layersSelector = createSelector(
  selectedAggregationJobsSelector,
  (jobs) => jobs.map((job) => job.aoi as any)
);

const selectedFile = (state: AppState) => state.ui.selectedFile;

const filesFlatSelector = (state: AppState) => state.ui.files;

export const filesSelector = createSelector(filesFlatSelector, (files) => {
  const res: Tree[] = [];

  for (const [key, value] of Object.entries(files)) {
    for (const file of value) {
      const parts = file.split('/');
      if (!res.find((f) => f.name === parts[0])) {
        res.push({ name: parts[0], id: parts[0], children: [] });
      }
      const fileName = parts.pop()!;
      const date = fileName.match(yearRegex)!;
      const year = date[1]!;
      const yearNode = res.find((f) => f.name === parts[0])!;
      if (!yearNode.children.find((f) => f.name === year)) {
        yearNode.children.push({
          name: year,
          id: date[2] ? parts[0] + year : file,
          children: [],
        });
      }
      if (date[2]) {
        const lastNode = yearNode.children.find((f) => f.name === year)!;
        const name = date[0].split('.')[0];
        if (!lastNode.children.find((f) => f.name === name)) {
          lastNode.children.push({ name, id: file, children: [] });
        }
      }
    }
  }

  return res;
});

export const selectedFilesSelector = createSelector(
  selectedFile,
  filesFlatSelector,
  (file, files) => {
    const res: string[] = [];
    if (!file) {
      return res;
    }
    const parts = file.split('/');
    const prefix = parts[0];
    const date = DateTime.fromISO(parts.pop()!.match(yearRegex)![1]!);
    for (const job of Object.keys(files)) {
      let jobFile: string | undefined = undefined;
      let jobDate: DateTime | undefined = undefined;
      for (const file of files[job]) {
        const parts = file.split('/');
        if (parts[0] === prefix) {
          const curDate = DateTime.fromISO(parts.pop()!.match(yearRegex)![1]!);
          if (curDate > date) {
            continue;
          }
          if (!jobDate || curDate > jobDate) {
            jobDate = curDate;
            jobFile = file;
          }
        }
      }
      if (jobFile) {
        res.push(jobFile);
      }
    }

    return res;
  }
);
