import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { JobExecutionCreated } from '../api-client';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExecutionTableDto } from './execution-table';

@Component({
  selector: 'app-executions-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
  ],
  templateUrl: './executions-list.component.html',
  styleUrl: './executions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExecutionsListComponent {
  displayedColumns: string[] = [
    'productType',
    'executionStartDate',
    'executionEndDate',
    'startDate',
    'endDate',
    'result',
    'rerun',
  ];

  columnsLabel: Record<string, string> = {
    id: 'Id',
    productType: 'Product Type',
    executionStartDate: 'Execution start date',
    executionEndDate: 'Execution end date',
    startDate: 'Period start date',
    endDate: 'Period end date',
    result: 'Result',
    rerun: 'Rerun',
    jobs: 'Jobs',
    errors: 'Errors',
  };

  allColumns: string[];

  dataSource = new MatTableDataSource<ExecutionTableDto>();

  executions = input.required<JobExecutionCreated[]>();

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor() {
    this.allColumns = Object.keys(this.columnsLabel);
    effect(() => {
      this.dataSource.data = this.executions().map(
        (e) => new ExecutionTableDto(e)
      );
      this.dataSource.sort = this.sort!;
      this.dataSource.paginator = this.paginator!;
    });
  }
}
