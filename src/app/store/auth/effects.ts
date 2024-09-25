import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './actions';
import { exhaustMap, map } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  authenticate = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setAuth),
      exhaustMap((action) =>
        this.authService
          .authenticate(action.apiUrl, action.apiKey)
          .pipe(map((user) => AuthActions.setUser({ user })))
      )
    )
  );
}
