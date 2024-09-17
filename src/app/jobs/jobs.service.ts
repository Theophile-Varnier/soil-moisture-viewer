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
  private _jobs$: Observable<JobTableDto[]>;

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
  ) {
    this._jobsByIds$ = combineLatest([
      this.authService.user$.pipe(filter((v) => !!v)),
      this._ids$.pipe(
        mergeMap((ids) => from(ids)),
        mergeMap((id) =>
          this.jobsApiService.getJobDetailJobsJobIdGet(id).pipe(
            catchError((err) => {
              return EMPTY;
            }),
            map((j) => new JobTableDto(j))
          )
        ),
        scan((acc, curr) => {
          if (this.pristine) {
            this.pristine = false;
            return [curr];
          }
          return [...acc, curr];
        }, [] as JobTableDto[])
      ),
    ]).pipe(map(([auth, id]) => id));

    this._currentPageJobs$ = combineLatest([
      this.authService.user$.pipe(filter((v) => !!v)),
      this._currentStatus$,
      this._currentPage$,
    ]).pipe(
      tap(() => this._loading$.next(true)),
      mergeMap(([auth, status, page]) =>
        this.jobsApiService
          .getJobListJobsGet(
            undefined,
            status.toUpperCase() as JobStatus,
            undefined,
            page,
            100
          )
          .pipe(
            map((jobs) => jobs.map((j) => new JobTableDto(j))),
            tap((jobs) => {
              if (jobs.length && page < 3) {
                this._currentPage$.next(page + 1);
              } else {
                this._loading$.next(false);
              }
            })
          )
      )
    );
    this._jobs$ = merge(
      this._currentPageJobs$.pipe(
        scan((acc, curr) => {
          if (this.pristine) {
            this.pristine = false;
            return [...curr];
          }
          return [...acc, ...curr];
        }, [] as JobTableDto[])
      ),
      this._jobsByIds$
    ).pipe(share());
  }

  setCurrentStatus(status: string) {
    this.pristine = true;
    this._currentStatus$.next(status);
    this._currentPage$.next(1);
  }

  setJobsId(ids: string[]) {
    this.pristine = true;
    this._ids$.next(ids);
  }

  rerunJobs(jobs: JobTableDto[]) {
    this._loading$.next(true);
    this.jobsApiService
      .rerunJobsJobsRerunPost(jobs.map((j) => j.id))
      .subscribe((d) => this._loading$.next(false));
  }

  setJobsStatus(jobs: JobTableDto[], status: JobStatus) {
    this._loading$.next(true);
    forkJoin(
      jobs.map((j) =>
        this.jobsApiService.updateJobJobsJobIdPatch(j.id, {
          status,
          endDate: j.endDate,
        })
      )
    ).subscribe((d) => {
      this._loading$.next(false);
      jobs.forEach((j) => (j.status = status));
    });
  }
}
