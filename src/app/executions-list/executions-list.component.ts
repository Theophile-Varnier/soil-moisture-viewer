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
  private _displayedColumns: string[] = [
    'id',
    'productType',
    'executionStartDate',
    'executionEndDate',
    'year',
    'result',
    'rerun',
    'jobs',
    'errors',
  ];

  private _displayedColumnsLight: string[] = [
    'id',
    'productType',
    'year',
    'errors',
  ];

  displayedColumns: string[];

  dataSource = new MatTableDataSource<ExecutionTableDto>();

  executions = input.required<JobExecutionCreated[]>();

  light = input<boolean>();

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor() {
    effect(() => {
      this.dataSource.data = this.executions().map(
        (e) => new ExecutionTableDto(e)
      );
      this.dataSource.sort = this.sort!;
      this.dataSource.paginator = this.paginator!;
      this.displayedColumns = this.light()
        ? this._displayedColumnsLight
        : this._displayedColumns;
    });
  }
}
