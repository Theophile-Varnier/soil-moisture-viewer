import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state';
import { AuthActions } from '../store/auth/actions';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  protected apiUrl: string = '';
  protected apiKey: string = '';
  protected user$ = this.store.select((state) => state.auth.user);
  constructor(private store: Store<AppState>) {}

  onSubmit() {
    this.store.dispatch(
      AuthActions.setAuth({ apiUrl: this.apiUrl, apiKey: this.apiKey })
    );
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    this.apiUrl = '';
    this.apiKey = '';
  }
}
