import { Routes, RouterModule } from '@angular/router';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';


// like a map, telling you the route

// route is a poart of angular framework
const routes: Routes = [
    {
        path: '',
        redirectTo: 'problems',
        pathMatch: 'full'
    },
    {
        path: 'problems',
        component: ProblemListComponent
    },
    {
        //might be problems/2, problem/8, etc..
        path: 'problems/:id',
        component: ProblemDetailComponent
    },
    {
        //default, the route that the function can't understand
        path: '**',
        redirectTo: 'problems'
    }
];

//must be exported, unless other file can't use it 
export const routing = RouterModule.forRoot(routes);