import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { Configuration } from './api-client';
import { provideState, provideStore } from '@ngrx/store';
import { jobsReducer } from './store/jobs/reducer';
import { authReducer } from './store/auth/reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './store/auth/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { JobsEffects } from './store/jobs/effects';
import { executionsReducer } from './store/executions/reducer';
import { ExecutionsEffects } from './store/executions/effects';
import { uiReducer } from './store/ui/reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    {
      provide: Configuration,
      useValue: new Configuration({
        basePath: 'http://localhost:3000',
      }),
    },
    provideAnimationsAsync(),
    provideStore(),
    provideState({ name: 'jobs', reducer: jobsReducer }),
    provideState({ name: 'auth', reducer: authReducer }),
    provideState({ name: 'executions', reducer: executionsReducer }),
    provideState({ name: 'ui', reducer: uiReducer }),
    provideEffects(AuthEffects, JobsEffects, ExecutionsEffects),
    provideStoreDevtools({
      name: 'Soil Moisture Viewer',
      maxAge: 30,
      trace: true,
      connectInZone: true,
    }),
  ],
};
