import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../../service/data.service";
import {CollaborationService} from "../../service/collaboration.service";
import {DomSanitizer} from "@angular/platform-browser";

declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  public languages: string[] = ['Python', 'JavaScript', 'Java'];
  editor: any;
  problemId: string;
  language: string = 'Python';
  graph: string = '';
  defaultContent = {
    'Python': `import matplotlib
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import os

matplotlib.use('Agg')
image = BytesIO()
plt.plot([1, 2, 3])
plt.savefig(image, format='png')
print(base64.b64encode(image.getvalue()).decode('ascii'))`,
    'JavaScript': '',
    'Java': ''
  };


  constructor(private route: ActivatedRoute,
              private collaborationService: CollaborationService,
              private dataService: DataService,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.problemId = params['id'];
      this.initEditor();
    });

    this.collaborationService.restoreBuffer();
  }

  initEditor(): void {
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/eclipse");
    this.resetEditor();

    document.getElementsByTagName('textarea')[0].focus();

    this.editor.setOption("maxLines", 20);
    this.editor.setOption("minLines", 20);

    this.editor.lastAppliedChange = null;

    this.collaborationService.init(this.editor, this.problemId);

    this.editor.on('change', e => {
      console.log('editor changes: ' + JSON.stringify(e));

      if (this.editor.lastAppliedChange !== e) {
        this.collaborationService.change(JSON.stringify(e));
      }
    });

  }

  resetEditor(): void {
    this.editor.setValue(this.defaultContent[this.language]);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  }

  submit(): void {
    const code = this.editor.getValue();
    console.log(code);

    const data = {
      code,
      lang: this.language.toLocaleLowerCase()
    };

    this.dataService.buildAndRun(data).then(res => {
      console.log('img string==:' + res);
      this.graph = 'data: image/png:base64,' + res;
    });
  }
}
