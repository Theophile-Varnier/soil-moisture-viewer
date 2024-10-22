import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { JobsFiltersComponent } from '../jobs-filters/jobs-filters.component';
import { ExecutionsFiltersComponent } from '../executions-filters/executions-filters.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-ui-filters',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatExpansionModule,
    MatTooltipModule,
    JobsFiltersComponent,
    ExecutionsFiltersComponent,
  ],
  templateUrl: './ui-filters.component.html',
  styleUrl: './ui-filters.component.scss',
})
export class UiFiltersComponent {
  panelOpen = false;
  focused = false;

  constructor() {}
}
