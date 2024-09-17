import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  mergeMap,
  Observable,
  of,
  shareReplay,
  Subject,
  tap,
} from 'rxjs';
import { Configuration, User, UsersService } from '../api-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth$: Subject<[string, string]> = new Subject<[string, string]>();
  constructor(
    private apiConfiguration: Configuration,
    private service: UsersService
  ) {
    this.user$ = this._auth$.pipe(
      tap(([apiUrl, apiKey]) => {
        this.apiConfiguration.basePath = apiUrl + '/latest';
        this.apiConfiguration.credentials = {
          APIKeyHeader: () => apiKey,
        };
      }),
      mergeMap((auth) =>
        auth[0] && auth[1]
          ? this.service.getUserUsersWhoamiGet().pipe(
              catchError((err) => {
                this.errored$.next(true);
                console.log(err);
                return of(null);
              })
            )
          : of(null)
      ),
      shareReplay()
    );
  }
  user$: Observable<User | null> = new Observable<User | null>();
  errored$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  setAuth(apiUrl: string, apiKey: string) {
    this._auth$.next([apiUrl, apiKey]);
  }

  logout() {
    this._auth$.next(['', '']);
  }
}
