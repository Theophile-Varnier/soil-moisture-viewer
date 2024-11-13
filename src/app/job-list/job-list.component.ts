import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { JobTableDto } from './job-table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
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
import { Store } from '@ngrx/store';
import { AppState } from '../store/state';
import { JobsActions } from '../store/jobs/actions';
import { JobDto, JobStatus } from '../api-client';
import { tap } from 'rxjs';

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
    MatMenuModule,
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
export class JobListComponent {
  jobStatus = JobStatus;
  availableColumns: string[] = [
    'id',
    'name',
    'createdAt',
    'productType',
    'subType',
    'status',
    'startDate',
    'endDate',
  ];
  displayedColumnsLight: string[] = ['id', 'name', 'productType', 'subType'];
  displayedColumns: string[];
  dataSource = new MatTableDataSource<JobTableDto>();

  light = input<boolean>();

  columnsLabel: Record<string, string> = {
    id: 'Id',
    name: 'Name',
    createdAt: 'Created at',
    productType: 'Product type',
    subType: 'Landsat level',
    status: 'Status',
    startDate: 'Start date',
    endDate: 'End date',
    actions: '',
  };

  selectedJobs$ = this.store.select((state) => state.jobs.selectedJobsIds);

  private numberOfSelectedJobs = 0;

  selectedJobsIds$ = this.store
    .select((state) => state.jobs.selectedJobsIds)
    .pipe(tap((ids) => (this.numberOfSelectedJobs = ids.length)));

  constructor(private store: Store<AppState>) {
    effect(() => {
      this.dataSource.data = this.jobs().map((j) => new JobTableDto(j));

      this.dataSource.sort = this.sort!;
      this.dataSource.paginator = this.paginator!;
      if (this.light()) {
        this.displayedColumns = [...this.displayedColumnsLight, 'actions'];
      } else {
        this.displayedColumns = [...this.availableColumns, 'actions'];
      }
    });
  }

  jobs = input.required<JobDto[]>();

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

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

  protected rerunJobs() {
    this.store.dispatch(JobsActions.rerunJobs());
  }

  protected updateJobsStatus(status: JobStatus) {
    this.store.dispatch(JobsActions.updateJobsStatus({ status }));
  }
}
