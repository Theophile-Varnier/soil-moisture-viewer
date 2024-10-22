import {
  JobExecutionCreated,
  JobExecutionResult,
  ProductType,
  SentryError,
} from '../api-client';
import { DateTime } from 'luxon';

export class ExecutionTableDto {
  id: string;
  executionStartDate: DateTime;
  executionEndDate: DateTime | null;
  startDate: DateTime;
  endDate: DateTime;
  productType: ProductType;
  result: JobExecutionResult | null | undefined;
  rerun: boolean;
  jobs: string[];
  errors: SentryError[];

  constructor(src: JobExecutionCreated) {
    this.id = src.id;
    this.executionStartDate = DateTime.fromISO(src.executionStartDate).set({
      millisecond: 0,
    });
    // .toISO({ suppressMilliseconds: true, includeOffset: false })!;
    this.executionEndDate = src.executionEndDate
      ? DateTime.fromISO(src.executionEndDate).set({ millisecond: 0 })
      : // .toISO({ suppressMilliseconds: true, includeOffset: false })!
        null;

    this.startDate = DateTime.fromISO(src.startDate);
    this.endDate = DateTime.fromISO(src.endDate);
    this.productType = src.productType;
    this.result = src.result;
    this.rerun = src.rerun!;
    this.jobs = src.jobs;
    this.errors = src.errors || [];
  }
}
