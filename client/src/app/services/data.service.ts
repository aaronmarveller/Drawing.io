import { Injectable } from '@angular/core';
import { Problem } from "../models/problem.model";
// import { PROBLEMS } from "../mock-problem";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
/*
  data service is kinda similar to 'agent'
*/

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _problemSource = new BehaviorSubject<Problem[]>([]);
  
  constructor(private httpClient: HttpClient) { }

  // getProblems(): Problem[] {
  //   return this.problems;
  // }
  
  // getProblem(id: number): Problem {
  //   //lambda foundation
  //   return this.problems.find((problem) => problem.id === id);
    
  //   /*
  //     (problem) => problem.id === id means:
  //     return problem id === id;  (which is a boolean type)
        
  //     function 'find' is a for-recycle
  //     also can be written as find((a) => a.id === id)

  //   */
  // }
  
  // addProblem(problem: Problem) {
  //   problem.id = this.problems.length + 1;
  //   this.problems.push(problem);
  // }
  
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
    return this.httpClient.get(`api/v1/problems/${id}`) //if use ``, ${id} represent a variable
      .toPromise()
      .then((res: any) => res)
      .catch(this.handleError);
  }
  
  addProblem(problem: Problem){
    const options = { headers: new HttpHeaders({'Content-Type':'application/json'})};
    return this.httpClient.post('api/vi/problems', problem, options)
      .toPromise()
      .then((res: any) => {
        this.getProblems();
        return res;
      })
      .catch(this.handleError);
  }
  
  private handleError(error: any): Promise<any>{
    return Promise.reject(error.body || error);
  }
  
}
