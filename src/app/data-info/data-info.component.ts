import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JobListComponent } from '../job-list/job-list.component';
import { ExecutionsListComponent } from '../executions-list/executions-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import {
  selectedAggregationJobsSelector,
  selectedAggregationSelector,
} from '../store/ui/selectors';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-data-info',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    JobListComponent,
    ExecutionsListComponent,
    MatTabsModule,
    MatTooltipModule,
  ],
  templateUrl: './data-info.component.html',
  styleUrl: './data-info.component.scss',
})
export class DataInfoComponent {
  panelOpen = false;
  aggregation$ = selectedAggregationSelector(this.store).pipe(
    tap((a) => {
      this.panelOpen = true;
    })
  );
  jobs$ = this.store.select(selectedAggregationJobsSelector);
  constructor(private store: Store<AppState>) {}
}
