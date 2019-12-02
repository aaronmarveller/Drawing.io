import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CollaborationService } from '../../services/collaboration.service';

declare var ace: any;   // typescript converted to JS

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  public languages: string[] = ['Java', 'Python'];
  editor: any;
  problemId: string;
  language:string = 'Python';
  
  defaultContent = {
    'Python': `class Solution:
        def example():
          # write your Python code here`,
    'Java': `class Solution{
        public void example(){
          # write your Java code here
        }
        }`
  }

  constructor(private route: ActivatedRoute, 
    private collaborationService: CollaborationService) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.problemId = params['id'];
        this.initEditor();
      });
      
      this.collaborationService.init(this.editor, this.problemId);
  }
  
  //basic function
  initEditor(): void {
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/eclipse");
    this.resetEditor();
    
    //set the  cursor at the location
    document.getElementsByTagName('textarea')[0].focus();
    
    this.editor.setOption("maxLines", 20);
    this.editor.setOption("minLines", 20);
  }
  
  resetEditor(): void {
    this.editor.setValue(this.defaultContent[this.language]);
  }
  
  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  } 
  
  submit(): void {
    let code = this.editor.getValue();
    console.log(code);
  }

}
