import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExecutionsListComponent } from '../executions-list/executions-list.component';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state';
import { displayedExecutionsSelector } from '../store/executions/selectors';

@Component({
  selector: 'app-executions',
  standalone: true,
  imports: [CommonModule, ExecutionsListComponent, MatCardModule],
  templateUrl: './executions.component.html',
  styleUrl: './executions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExecutionsComponent {
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

  executions$ = this.store.select(displayedExecutionsSelector);

  constructor(private store: Store<AppState>) {}
}
