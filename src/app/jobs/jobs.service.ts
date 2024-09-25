import { Injectable } from '@angular/core';
import { JobsService as JobsApiService, JobStatus } from '../api-client';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  filter,
  forkJoin,
  from,
  map,
  merge,
  mergeMap,
  Observable,
  scan,
  share,
  Subject,
  tap,
  toArray,
} from 'rxjs';
import { JobTableDto } from '../job-list/job-table';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  private pristine: boolean = true;
  private _jobs$: Observable<JobTableDto[]> = new BehaviorSubject<
    JobTableDto[]
  >([]);

  public get jobs$(): Observable<JobTableDto[]> {
    return this._jobs$;
  }

  private _loading$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  public get loading$(): Observable<boolean> {
    return this._loading$;
  }

  private _currentStatus$: Subject<string> = new BehaviorSubject<string>('');

  private _currentPage$: Subject<number> = new BehaviorSubject<number>(1);

  private _currentPageJobs$: Observable<JobTableDto[]>;

  private _ids$: Subject<string[]> = new Subject<string[]>();

  private _jobsByIds$: Observable<JobTableDto[]>;

  constructor(
    private jobsApiService: JobsApiService,
    private authService: AuthService
  ) {}

  setCurrentStatus(status: string) {}

  setJobsId(ids: string[]) {}

  rerunJobs(jobs: JobTableDto[]) {}

  setJobsStatus(jobs: JobTableDto[], status: JobStatus) {}
}
