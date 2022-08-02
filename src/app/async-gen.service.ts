import { Injectable } from '@angular/core';

export interface Commit {
  authorName: string;
  authorEmail: string;
  message: string;
  sha: string;
}

@Injectable({
  providedIn: 'root',
})
export class AsyncGenService {
  public readonly repo = 'You-Dont-Know-JS';
  private nextCommitsUrl: string | null = `https://api.github.com/repos/stepan20000/${this.repo}/commits`;


  public async *getCommits(): AsyncGenerator<Commit[]> {
    let counter = 2;
    while(this.nextCommitsUrl && counter) {
      await pause(5000);
      const response = await this.getNextCommitsResponse();
      const body = await response.json();
      const commits = body.map((val: any) => this.createCommit(val));
      counter--;
      this.nextCommitsUrl = this.getNextCommitsLinkFromResponse(response);
      yield commits;
    }
  }

  private createCommit(rawCommit: any): Commit {
    return {
      authorName: rawCommit.commit.author.name,
      authorEmail: rawCommit.commit.author.email,
      message: rawCommit.commit.message, 
      sha: rawCommit.sha,
    }
  }

  private getNextCommitsResponse(): Promise<Response> {
    return fetch(
      this.nextCommitsUrl as string, 
      {
        headers: { Authorization: 'token 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' }
      },
    );
  }

  private getNextCommitsLinkFromResponse(response: Response): string | null {
    return response.headers.get('link')?.split(';')[0].slice(1, -1) || null;
  }
}

function pause(delay = 100) {
  return new Promise(resolve => setTimeout(resolve, delay))
}
