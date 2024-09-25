import { Store } from '@ngrx/store';
import { AppState } from '../state';
import { filter, share, tap } from 'rxjs';

const userSelector = (state: AppState) => state.auth.user;

export const authenticatedUserSelector = (store: Store<AppState>) =>
  store.select(userSelector).pipe(
    filter((user) => !!user),
    share()
  );
