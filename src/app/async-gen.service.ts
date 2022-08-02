import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatWith, delay, first, map, Observable, of, scan, startWith, Subject, switchMap, take, tap } from 'rxjs';

interface Commit {
  authorName: string;
  authorEmail: string;
  message: string;
  sha: string;
}

@Injectable({
  providedIn: 'root'
})
export class AsyncGenService {
  public readonly repo = 'You-Dont-Know-JS';
  private commitsSync = new Subject<void>;
  public readonly commits$: Observable<Commit[]>;
  private nextCommitsUrl: string | null = `https://api.github.com/repos/stepan20000/${this.repo}/commits`;

  constructor(private http: HttpClient) {
    this.commits$ = this.commitsSync.pipe(
      delay(5000),
      take(2),
      switchMap(() => this.createCommitsStream()),
      startWith([] as Commit[]),
      scan<Commit[]>((acc: Commit[], commits: Commit[]) => acc.concat(commits)),
      tap(console.log),
    )
  }

  public getCommits(): void {
    this.commitsSync.next();
  }

  private createCommitsStream(): Observable<Commit[]> {
    const headers  = new HttpHeaders().set('Authorization', 'token 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')
    return this.nextCommitsUrl
      ? this.http.get(this.nextCommitsUrl as string, { observe: 'response', headers }).pipe(
          tap(res => this.nextCommitsUrl = res.headers.get('link')?.split(';')[0].slice(1, -1) || null),
          map(({ body }) => (body as any).map((commit: any) => this.createCommit(commit))),
          tap(() => this.commitsSync.next()),
        )
      : of([]);
  }

  private createCommit(rawCommit: any): Commit {
    return {
      authorName: rawCommit.commit.author.name,
      authorEmail: rawCommit.commit.author.email,
      message: rawCommit.commit.message, 
      sha: rawCommit.sha,
    }
  }
}
