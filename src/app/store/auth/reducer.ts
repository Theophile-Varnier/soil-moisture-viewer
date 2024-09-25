import { createReducer, on } from '@ngrx/store';
import { User } from '../../api-client';
import { AuthActions } from './actions';

export interface AuthState {
  apiUrl: string;
  apiKey: string;
  user: User | null;
}

export const initialState: AuthState = {
  apiUrl: '',
  apiKey: '',
  user: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.setAuth, (state, { apiUrl, apiKey }) => ({
    ...state,
    apiUrl,
    apiKey,
  })),
  on(AuthActions.setUser, (state, { user }) => ({
    ...state,
    user,
  })),
  on(AuthActions.logout, (state) => initialState)
);
