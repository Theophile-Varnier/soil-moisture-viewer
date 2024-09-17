import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

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
  protected errorMessage = signal('');
  constructor(protected authService: AuthService) {
    this.authService.errored$.subscribe((errored) => {
      if (errored) {
        this.errorMessage.set('Error authenticating');
      }
    });
  }

  onSubmit() {
    this.authService.setAuth(this.apiUrl, this.apiKey);
  }

  logout() {
    this.apiUrl = '';
    this.apiKey = '';
    this.authService.logout();
  }
}
