import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { DateTime } from 'luxon';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'yyyy',
  },
  display: {
    dateInput: 'yyyy',
    monthYearLabel: 'yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'yyyy',
  },
};

/** @title Datepicker emulating a Year and month picker */
@Component({
  selector: 'app-year-picker',
  templateUrl: 'year-picker.component.html',
  styleUrl: 'year-picker.component.scss',
  providers: [
    // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
    // to your app config. We provide it at the component level here, due to limitations
    // of our example generation script.
    provideLuxonDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearPickerComponent {
  label = input.required<string>();
  date = model<DateTime>();
  readonly dateControl = new FormControl(
    this.date() || DateTime.fromJSDate(new Date(new Date().getFullYear(), 0, 1))
  );

  setYear(
    normalizedMonthAndYear: DateTime,
    datepicker: MatDatepicker<DateTime>
  ) {
    const ctrlValue = this.dateControl.value!;
    this.dateControl.setValue(
      ctrlValue.set({ year: normalizedMonthAndYear.year })
    );
    datepicker.close();
    this.date.set(ctrlValue);
  }
}
