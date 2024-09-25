import {
  JobExecutionCreated,
  JobExecutionResult,
  ProductType,
} from '../api-client';
import { DateTime } from 'luxon';

export class ExecutionTableDto {
  id: string;
  executionStartDate: string;
  executionEndDate: string | null;
  startDate: string;
  endDate: string;
  productType: ProductType;
  result: JobExecutionResult | null | undefined;
  rerun: boolean;
  jobs: string[];
  errors: any[];

  constructor(src: JobExecutionCreated) {
    this.id = src.id;
    this.executionStartDate = DateTime.fromISO(src.executionStartDate)
      .set({ millisecond: 0 })
      .toISO({ suppressMilliseconds: true, includeOffset: false })!;
    this.executionEndDate = src.executionEndDate
      ? DateTime.fromISO(src.executionEndDate)
          .set({ millisecond: 0 })
          .toISO({ suppressMilliseconds: true, includeOffset: false })!
      : null;

    this.startDate = DateTime.fromISO(src.startDate).toFormat('yyyy-MM-dd');
    this.endDate = DateTime.fromISO(src.endDate).toFormat('yyyy-MM-dd');
    this.productType = src.productType;
    this.result = src.result;
    this.rerun = src.rerun!;
    this.jobs = src.jobs;
    this.errors = src.errors;
  }
}
