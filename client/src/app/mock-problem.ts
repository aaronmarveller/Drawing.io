import { Problem } from './models/problem.model';


//'export' is to let other file to use
export const PROBLEMS: Problem[] = [     //constant should be named capital
  {
    "id": 1,
    "name": "Staight line",
    "desc": "Draw a simple straight line",
    "difficulty": "easy"
  },
  {
    "id": 2,
    "name": "Staight lines",
    "desc": "Draw two simple straight lines",
    "difficulty": "medium"
  },
  {
    "id": 3,
    "name": "Sine curve",
    "desc": "Draw a sine curve",
    "difficulty": "medium"
  },
  {
    "id": 4,
    "name": "Bar chart",
    "desc": "Draw a bar chart represent GDP growth",
    "difficulty": "hard"
  },
  {
    "id": 5,
    "name": "3D diagram",
    "desc": "Draw a 3D diagram of ball",
    "difficulty": "super"
  }
  ];
