import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";
import { Problem } from "../../models/problem.model";
import { DataService } from "../../service/data.service";

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit {
  problem: Problem;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.dataService.getProblem(+params['id']) // + convert to number
        .then(problem => this.problem = problem);
    })

    /* demo code for promise & RxJS

    let promise = new Promise(resolve => {
      console.log('promise start');
      setTimeout(() => {
        resolve('promise resolved');
      }, 3000);
    });

    promise.then((value: string) => {console.log(value)});

    let stream$ = new Observable(observer => {
      console.log('observable start');
      observer.next(1);
      observer.next(2);
    });

    let sub = stream$.subscribe(value => console.log(value));
    let sub2 = stream$.subscribe(value => console.log(value));

     */
  }

}
