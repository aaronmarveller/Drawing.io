import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { Problem } from "../../models/problem.model";
import { DataService } from "../../service/data.service";

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problems: Problem[];
  subscriptionProblems: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getProblem();
  }

  ngOnDestroy(): void {
    this.subscriptionProblems.unsubscribe();
  }

  getProblem(): void {
    this.subscriptionProblems = this.dataService.getProblems()
      .subscribe(problems => {
        this.problems = problems;
      })
  }

}
