import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../api-client';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Set Auth': props<{ apiUrl: string; apiKey: string }>(),
    'Set User': props<{ user: User | null }>(),
    Logout: emptyProps(),
  },
});
