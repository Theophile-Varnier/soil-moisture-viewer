import { createSelector } from '@ngrx/store';
import { AppState } from '../state';
import { Aggregation } from './reducer';
import { DateTime } from 'luxon';
import { JobExecutionResult } from '../../api-client';

const executionsSelector = (state: AppState) => state.executions.executions;
const filtersSelector = (state: AppState) => state.filters;

export const displayedExecutionsSelector = createSelector(
  executionsSelector,
  filtersSelector,
  (executions, filters) =>
    !filters.ui.error &&
    !filters.ui.ids.length &&
    filters.result.includeError &&
    filters.result.includeSuccess
      ? executions
      : executions.filter(
          (execution) =>
            (!filters.ui.error ||
              execution.errors?.find(
                (e) =>
                  e.id
                    ?.toLowerCase()
                    .includes(filters.ui.error.toLowerCase()) ||
                  e.message
                    ?.toLowerCase()
                    .includes(filters.ui.error.toLowerCase()) ||
                  e.name?.toLowerCase().includes(filters.ui.error.toLowerCase())
              )) &&
            (!filters.ui.ids.length ||
              execution.jobs.some((job) => filters.ui.ids.includes(job))) &&
            (filters.result.includeError ||
              execution.result !== JobExecutionResult.Error) &&
            (filters.result.includeSuccess ||
              execution.result !== JobExecutionResult.Success)
        )
);

export const aggregationsSelector = createSelector(
  displayedExecutionsSelector,
  (executions) =>
    executions.reduce<Aggregation[]>((acc, execution) => {
      let previousAggregation: Aggregation | undefined = undefined;
      for (const job of execution.jobs) {
        const jobAggregation = acc.find((agg) => agg.jobs.includes(job));
        if (!jobAggregation && !previousAggregation) {
          previousAggregation = {
            id: execution.id,
            jobs: execution.jobs,
            executions: [],
            start: DateTime.fromISO(execution.startDate),
            end: DateTime.fromISO(execution.endDate),
          };
          acc.push(previousAggregation);
        } else if (
          previousAggregation &&
          jobAggregation &&
          previousAggregation !== jobAggregation
        ) {
          previousAggregation.executions.push(...jobAggregation.executions);
          acc = acc.filter((agg) => agg !== jobAggregation);
        } else {
          previousAggregation = previousAggregation || jobAggregation!;
        }
        if (
          !previousAggregation.executions.find((e) => e.id === execution.id)
        ) {
          previousAggregation.executions.push(execution);
        }
        if (
          execution.jobs.length >= previousAggregation.jobs.length &&
          execution.geoLocation
        ) {
          const geoLocation = execution.geoLocation as any;
          previousAggregation.geoLocation = `${geoLocation.toponymName}, ${geoLocation.adminName1}, ${geoLocation.countryName}`;
        }

        previousAggregation.start = DateTime.min(
          ...previousAggregation.executions.map((e) =>
            DateTime.fromISO(e.startDate)
          )
        );
        previousAggregation.end = DateTime.max(
          ...previousAggregation.executions.map((e) =>
            DateTime.fromISO(e.endDate)
          )
        );
      }
      return acc;
    }, [])
);
