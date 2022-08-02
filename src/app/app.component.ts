import { Component } from '@angular/core';
import { AsyncGenService, Commit } from './async-gen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'angular-experiments';
  public readonly repo = this.asyncGenService.repo;
  public commits: Commit[] = [];

  constructor(private asyncGenService: AsyncGenService) {}

  public async getCommits(): Promise<void> {
    for await (const commits of this.asyncGenService.getCommits()) {
      this.commits = this.commits.concat(commits);
    }
  } 
}
