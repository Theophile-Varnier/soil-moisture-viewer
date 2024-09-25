import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Configuration, User, UsersService } from '../api-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private apiConfiguration: Configuration,
    private service: UsersService
  ) {}

  authenticate(apiUrl: string, apiKey: string): Observable<User | null> {
    this.apiConfiguration.basePath = new URL('latest', apiUrl).toString();
    this.apiConfiguration.credentials = {
      APIKeyHeader: () => apiKey,
    };
    return this.service
      .getUserUsersWhoamiGet()
      .pipe(catchError((err) => of(null)));
  }
}
