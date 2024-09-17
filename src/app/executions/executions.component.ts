import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { JobExecutionCreated, RunsService } from '../api-client';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  mergeMap,
  Subject,
} from 'rxjs';
import {
  DateRange,
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateTime } from 'luxon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ExecutionsListComponent } from '../executions-list/executions-list.component';

@Component({
  selector: 'app-executions',
  standalone: true,
  imports: [
    CommonModule,
    ExecutionsListComponent,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    MatTableModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [provideLuxonDateAdapter()],
  templateUrl: './executions.component.html',
  styleUrl: './executions.component.scss',
})
export class ExecutionsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'productType',
    'executionStartDate',
    'executionEndDate',
    'startDate',
    'endDate',
    'result',
    'rerun',
    'jobs',
  ];

  protected includeRunningExecutions: boolean = true;
  protected includeFinishedExecutions: boolean = false;
  protected statusFilter$: Subject<boolean | undefined> = new BehaviorSubject<
    boolean | undefined
  >(false);
  protected startDate$: Subject<DateTime> = new BehaviorSubject<DateTime>(
    DateTime.now().startOf('day')
  );
  protected endDate$: Subject<DateTime> = new BehaviorSubject<DateTime>(
    DateTime.now().startOf('day')
  );
  executions: JobExecutionCreated[] = [];
  constructor(
    private runsService: RunsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    combineLatest([
      this.authService.user$.pipe(filter((v) => !!v)),
      this.statusFilter$,
      this.startDate$,
      this.endDate$.pipe(filter((date) => !!date)),
    ])
      .pipe(
        mergeMap(([auth, status, startDate, endDate]) =>
          this.runsService.getRunsRunsGet(
            undefined,
            status,
            startDate.toISODate()!,
            endDate.plus({ days: 1 }).toISODate()!
          )
        )
      )
      .subscribe((executions) => {
        this.executions = executions;
      });
  }

  protected setStatusFilter() {
    if (this.includeRunningExecutions && this.includeFinishedExecutions) {
      this.statusFilter$.next(undefined);
    } else {
      this.statusFilter$.next(this.includeFinishedExecutions);
    }
  }

  protected isDisabled(currentValue: boolean) {
    return (
      this.includeFinishedExecutions != this.includeRunningExecutions &&
      currentValue
    );
  }

  protected setDates(
    event: MatDatepickerInputEvent<any, DateRange<any>>,
    target: Subject<DateTime>
  ) {
    target.next(event.value);
  }
}
