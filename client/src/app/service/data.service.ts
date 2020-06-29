import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';

import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _problemSource = new BehaviorSubject<Problem[]>([]);

  constructor(private httpClient: HttpClient) { }

  getProblems(): Observable<Problem[]> {
    this.httpClient.get('api/v1/problems')
      .toPromise()
      .then((res: any) => {
        this._problemSource.next(res);
      })
      .catch(this.handleError);

    return this._problemSource.asObservable();
  }

  getProblem(id: number): Promise<Problem> {
    //traverse all the problems and find problem whose id is given one
    return this.httpClient.get(`api/v1/problems/${id}`)
      .toPromise()
      .then((res: any) => res)
      .catch(this.handleError);
  }

  addProblem(problem: Problem) {
    // problem.id = this.problems.length + 1;
    // this.problems.push(problem);
    const options = { headers: new HttpHeaders({'Content-Type': 'application/json'}) };
    return this.httpClient.post('api/v1/problems', problem, options)
      .toPromise()
      .then((res: any) => {
        this.getProblems();
        return res;
      })
      .catch(this.handleError);
  }

  buildAndRun(data: any): Promise<any> {
    const options = { headers: new HttpHeaders({'Content-Type': 'application/json'}) };
    return this.httpClient.post('api/v1/build_and_run', data, options)
      .toPromise()
      .then((res: any) => {
        return res;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.body || error);
  }
}
