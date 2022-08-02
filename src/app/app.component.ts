import { Component } from '@angular/core';
import { AsyncGenService } from './async-gen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'angular-experiments';
  public readonly repo = this.asyncGenService.repo;
  public commits$ = this.asyncGenService.commits$;

  constructor(private asyncGenService: AsyncGenService) {}

  public onGetNewCommits(): void {
    this.asyncGenService.getCommits();
  }
}
