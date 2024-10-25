import { createSelector, Store } from '@ngrx/store';
import { AppState } from '../state';
import { filter, share } from 'rxjs';
import { jobsSelector } from '../jobs/selectors';
import { aggregationsSelector } from '../executions/selectors';
import { Tree } from './reducer';

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

const selectedFile = (state: AppState) => state.ui.selectedFile;

export const filesSelector = createSelector(
  selectedAggregationJobsSelector,
  (jobs) => {
    const yearRegex = new RegExp('([0-9]{4})([0-9]{4})?.tif');
    const res: Tree[] = [];
    const files = jobs.flatMap((job) => job.files);

    files.forEach((file) => {
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
          id: parts[0] + year,
          children: [],
        });
      }
      const lastNode = yearNode.children.find((f) => f.name === year)!;
      const name = date[0].split('.')[0];
      if (!lastNode.children.find((f) => f.name === name)) {
        lastNode.children.push({ name, id: file, children: [] });
      }
    });

    return res;
  }
);

export const selectedFilesSelector = createSelector(
  selectedFile,
  filesSelector,
  (file, files) => {
    const res: string[] = [];
    if (!file) {
      return res;
    }
    const parts = file.split('/');
    const prefix = parts[0];

    return res;
  }
);
