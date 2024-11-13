import { DateTime } from 'luxon';
import {
  JobDto,
  JobExecutionInfo,
  JobStatus,
  ProductSubType,
  ProductType,
} from '../api-client';

export class JobTableDto {
  id: string;
  name?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: JobStatus;
  productType: ProductType;
  subType: ProductSubType;
  executions: JobExecutionInfo[] = [];
  createdAt: string;

  constructor(src: JobDto) {
    this.id = src.id;
    this.name = src.name;
    this.startDate = src.startDate;
    this.endDate = src.endDate;
    this.status = src.status;
    this.productType = src.productType;
    this.subType = src.subtype;
    this.createdAt = DateTime.fromISO(src.createdAt)
      .set({ millisecond: 0 })
      .toISO({
        suppressMilliseconds: true,
        includeOffset: false,
      })!;
  }
}
