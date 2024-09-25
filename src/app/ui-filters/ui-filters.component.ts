import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppState } from '../store/state';
import { aggregationsSelector } from '../store/executions/selectors';
import { Store } from '@ngrx/store';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-ui-filters',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTabsModule],
  templateUrl: './ui-filters.component.html',
  styleUrl: './ui-filters.component.scss',
})
export class UiFiltersComponent {
  aggregations$ = this.store.select(aggregationsSelector);
  selectedAggregations = this.store.select(
    (state) => state.ui.selectedAggregations
  );
  panelOpen = false;

  constructor(private store: Store<AppState>) {}
}
