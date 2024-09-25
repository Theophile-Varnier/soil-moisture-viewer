import { AuthState } from './auth/reducer';
import { ExecutionsState } from './executions/reducer';
import { JobsState } from './jobs/reducer';
import { UiState } from './ui/reducer';

export interface AppState {
  jobs: JobsState;
  auth: AuthState;
  executions: ExecutionsState;
  ui: UiState;
}
