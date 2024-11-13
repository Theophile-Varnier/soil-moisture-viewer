import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppState } from '../store/state';
import { aggregationsSelector } from '../store/executions/selectors';
import { Store } from '@ngrx/store';
import { MatTabsModule } from '@angular/material/tabs';
import { Aggregation } from '../store/executions/reducer';
import { UiActions } from '../store/ui/actions';
import { tap } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { selectedAggregation } from '../store/ui/selectors';

@Component({
  selector: 'app-ui-data-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatTooltipModule,
  ],
  templateUrl: './ui-data-selector.component.html',
  styleUrl: './ui-data-selector.component.scss',
})
export class UiDataSelectorComponent {
  aggregations$ = this.store.select(aggregationsSelector).pipe(
    tap((a) => {
      if (a.length) {
        this.panelOpen = true;
      }
    })
  );
  selectedAggregation$ = this.store.select(selectedAggregation);
  panelOpen = false;

  constructor(private store: Store<AppState>) {}

  isSelected(
    aggregation: Aggregation,
    selectedAggregation: Aggregation | undefined | null
  ) {
    return selectedAggregation?.id === aggregation.id;
  }

  selectAggregation(aggregation: Aggregation) {
    this.store.dispatch(UiActions.selectAggregation({ aggregation }));
    this.panelOpen = false;
  }
}
