import { CommonModule } from '@angular/common';
import { Component, effect, model, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppState } from '../store/state';
import { Store } from '@ngrx/store';
import { JobBase, ProductType } from '../api-client';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { YearPickerComponent } from '../year-picker/year-picker.component';
import { DateTime } from 'luxon';
import { JobsActions } from '../store/jobs/actions';

@Component({
  selector: 'app-job-creator',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatExpansionModule,
    MatTooltipModule,
    MatCheckboxModule,
    YearPickerComponent,
  ],
  templateUrl: './job-creator.component.html',
  styleUrl: './job-creator.component.scss',
})
export class JobCreatorComponent {
  panelOpen = false;
  productType = Object.values(ProductType);
  drawOnMap = output();
  aoi = model<any>();
  aoiString: string = '';
  aois = model<any[]>();
  name: string = '';
  startDate: DateTime = DateTime.now().startOf('year');
  generateAois = output<{ numberOfJobs: number; keepBbox: boolean }>();

  numberOfJobs = 10;
  selectedProductType = ProductType.Whc;
  keepBbox = true;

  constructor(private store: Store<AppState>) {
    effect(() => {
      this.aoiString = JSON.stringify(this.aoi(), null, 2);
    });
  }

  createSingleJob() {
    const job: JobBase = {
      aoi: JSON.parse(this.aoiString),
      productType: this.selectedProductType,
      startDate: this.startDate.toISO(),
      name: this.name ? this.name : undefined,
    };
    this.store.dispatch(JobsActions.createJobs({ jobs: [job] }));
  }

  createMultipleJobs() {
    const aois = this.aois();
    if (aois && aois.length) {
      this.store.dispatch(
        JobsActions.createJobs({
          jobs: aois.map((aoi, index) => {
            return {
              name: `${DateTime.now().toFormat('yyyyMMddHHmmss')}_${index}`,
              aoi: aoi as any,
              productType: this.selectedProductType,
              startDate: this.startDate.toISO(),
            };
          }),
        })
      );
    }
  }
}
