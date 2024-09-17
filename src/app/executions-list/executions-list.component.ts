import { Component, effect, input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { JobExecutionCreated } from '../api-client';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-executions-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    MatTableModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [provideLuxonDateAdapter()],
  templateUrl: './executions-list.component.html',
  styleUrl: './executions-list.component.scss',
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
    'jobs',
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
  };

  allColumns: string[];

  dataSource = new MatTableDataSource<JobExecutionCreated>();

  executions = input.required<JobExecutionCreated[]>();

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor() {
    this.allColumns = Object.keys(this.columnsLabel);
    effect(() => {
      this.dataSource.data = this.executions();
      this.dataSource.sort = this.sort!;
      this.dataSource.paginator = this.paginator!;
    });
  }
}
