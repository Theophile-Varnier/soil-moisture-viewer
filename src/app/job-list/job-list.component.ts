import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { JobTableDto } from './job-table';
import { Subscription, tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ExecutionsListComponent } from '../executions-list/executions-list.component';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state';
import { jobsTableSelector } from '../store/jobs/selectors';
import { JobsActions } from '../store/jobs/actions';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    ExecutionsListComponent,
  ],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class JobListComponent implements OnDestroy, OnInit {
  availableColumns: string[] = [
    'id',
    'name',
    'productType',
    'subType',
    'status',
    'startDate',
    'endDate',
    'errored',
    'lastExecution',
  ];
  displayedColumns: string[];
  displayedLabels: string[];
  dataSource = new MatTableDataSource<JobTableDto>();
  private jobsSubscription?: Subscription;
  private mandatoryColumns: string[] = ['actions', 'expand'];

  columnsLabel: Record<string, string> = {
    id: 'Id',
    name: 'Name',
    productType: 'Product type',
    subType: 'Subtype',
    status: 'Status',
    startDate: 'Start date',
    endDate: 'End date',
    errored: 'Errored',
    lastExecution: 'Last execution date',
    expand: '',
    actions: '',
  };

  expandedJob?: JobTableDto;

  private numberOfSelectedJobs = 0;

  selectedJobsIds$ = this.store
    .select((state) => state.jobs.selectedJobsIds)
    .pipe(tap((ids) => (this.numberOfSelectedJobs = ids.length)));

  constructor(private store: Store<AppState>) {
    this.displayedLabels = [...this.availableColumns];
    this.displayedColumns = [...this.displayedLabels, ...this.mandatoryColumns];
  }

  ngOnInit() {
    this.jobsSubscription = this.store
      .select(jobsTableSelector)
      .subscribe((jobs) => {
        this.dataSource.data = jobs;

        this.dataSource.sort = this.sort!;
        this.dataSource.paginator = this.paginator!;
      });
  }

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  ngOnDestroy() {
    if (this.jobsSubscription) {
      this.jobsSubscription.unsubscribe();
    }
  }

  protected toggleSelectAll(selected: boolean) {
    this.store.dispatch(
      JobsActions.batchSelectJobs({
        ids: selected ? this.dataSource.data.map((job) => job.id) : [],
      })
    );
  }

  protected toggleSelect(job: JobTableDto, checked: boolean) {
    this.store.dispatch(
      checked
        ? JobsActions.selectJob({ id: job.id })
        : JobsActions.deselectJob({ id: job.id })
    );
  }

  protected allChecked(): boolean {
    return (
      !!this.dataSource.data.length &&
      this.numberOfSelectedJobs === this.dataSource.data.length
    );
  }

  protected someChecked(): boolean {
    return (
      this.numberOfSelectedJobs > 0 &&
      this.numberOfSelectedJobs < this.dataSource.data.length
    );
  }

  protected updateSelection() {
    this.displayedColumns = [...this.displayedLabels, ...this.mandatoryColumns];
  }
}
