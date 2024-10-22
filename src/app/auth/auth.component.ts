import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state';
import { AuthActions } from '../store/auth/actions';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  protected envs = [
    {
      name: 'dev',
      apiUrl: 'http://54.216.158.69',
    },
    {
      name: 'staging',
      apiUrl: 'https://api-landbanking-dta.lobelia.earth',
    },
    {
      name: 'prod',
      apiUrl: 'https://api-landbanking.lobelia.earth',
    },
    {
      name: 'localhost',
      apiUrl: 'http://localhost:8000',
    },
  ];
  protected env = this.envs[0];
  protected apiKey: string = '';
  protected user$ = this.store.select((state) => state.auth.user);
  constructor(private store: Store<AppState>) {}

  onSubmit() {
    this.store.dispatch(
      AuthActions.setAuth({ apiUrl: this.env.apiUrl, apiKey: this.apiKey })
    );
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    this.apiKey = '';
  }
}
