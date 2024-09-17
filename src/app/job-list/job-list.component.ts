import {
  ChangeDetectionStrategy,
  Component,
  model,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { JobsService } from '../jobs/jobs.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { JobTableDto } from './job-table';
import { Subscription } from 'rxjs';
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

  selectedJobs = model<JobTableDto[]>([]);

  constructor(protected jobsService: JobsService) {
    this.displayedLabels = [...this.availableColumns];
    this.displayedColumns = [...this.displayedLabels, ...this.mandatoryColumns];
  }

  ngOnInit() {
    this.jobsSubscription = this.jobsService.jobs$.subscribe((jobs) => {
      this.selectedJobs.set([]);
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
    if (selected) {
      this.selectedJobs.set(this.dataSource.data);
    } else {
      this.selectedJobs.set([]);
    }
  }

  protected toggleSelect(job: JobTableDto) {
    this.selectedJobs.update((jobs) => {
      if (jobs.includes(job)) {
        return jobs.filter((j) => j !== job);
      }
      return [...jobs, job];
    });
  }

  protected allChecked(): boolean {
    return (
      !!this.dataSource.data.length &&
      this.dataSource.data.every((job) => this.selectedJobs()?.includes(job))
    );
  }

  protected someChecked(): boolean {
    return (
      this.dataSource.data.some((job) => this.selectedJobs()?.includes(job)) &&
      this.dataSource.data.some((job) => !this.selectedJobs()?.includes(job))
    );
  }

  protected updateSelection() {
    this.displayedColumns = [...this.displayedLabels, ...this.mandatoryColumns];
  }
}
