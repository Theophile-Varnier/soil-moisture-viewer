import {
  JobDto,
  JobExecutionInfo,
  JobExecutionResult,
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
  errored: boolean = false;
  lastExecution?: string;
  productType: ProductType;
  subType: ProductSubType;
  executions: JobExecutionInfo[] = [];

  constructor(src: JobDto) {
    this.id = src.id;
    this.name = src.name;
    this.startDate = src.startDate;
    this.endDate = src.endDate;
    this.status = src.status;
    this.productType = src.productType;
    this.subType = src.subtype;
    this.errored = src.executions.some(
      (e) => e.result === JobExecutionResult.Error
    );
    if (src.executions.length > 0) {
      this.lastExecution = new Date(
        Math.max(
          ...src.executions.map((e) => new Date(e.executionStartDate).getTime())
        )
      ).toISOString();
    }
    this.executions = src.executions.sort(
      (a, b) =>
        new Date(b.executionStartDate).getTime() -
        new Date(a.executionStartDate).getTime()
    );
  }
}
