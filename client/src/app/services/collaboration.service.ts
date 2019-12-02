import { Injectable } from '@angular/core';

// converted to typescript
declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  collaborationSocekt: any;
  
  constructor() { }
  
  init(editor: any, problemId: string): void {
    //window.location.origin is the url of the website
    this.collaborationSocekt = io(window.location.origin, { query: 'problemId=' + problemId }); 
    
    this.collaborationSocekt.on('message', (message) => {
      console.log('message received from server:' + message);
    });
    
  }
  
}
