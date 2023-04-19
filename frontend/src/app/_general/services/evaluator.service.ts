
/*
 * Copyright (c) Aista Ltd, 2021 - 2023 info@aista.com, all rights reserved.
 */

// Angular and system imports.
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';

// Application specific imports.
import { FileService } from './file.service';
import { HttpService } from 'src/app/_general/services/http.service';
import { MagicResponse } from '../models/magic-response.model';

/**
 * Hyperlambda evaluator service allowing you to evaluate Hyperlambda in
 * your backend.
 */
@Injectable({
  providedIn: 'root'
})
export class EvaluatorService {

  constructor(
    private httpService: HttpService,
    private fileService: FileService) { }

  execute(hyperlambda: string) {

    return this.httpService.post<MagicResponse>('/magic/system/evaluator/evaluate', {
      hyperlambda
    });
  }

  snippets() {

    return this.fileService.listFiles('/etc/snippets/');
  }

  loadSnippet(filename: string) {

    if (filename.indexOf('/') !== -1) {
      return throwError(() => new Error('Not a valid filename'));
    }
    filename = '/etc/snippets/' + filename;
    if (!filename.endsWith('.hl')) {
      filename += '.hl';
    }
    return this.fileService.loadFile(filename);
  }

  saveSnippet(filename: string, content: string) {

    if (filename.indexOf('/') !== -1) {
      return throwError(() => new Error('Not a valid filename'));
    }
    filename = '/etc/snippets/' + filename;
    if (!filename.endsWith('.hl')) {
      filename += '.hl';
    }
    return this.fileService.saveFile(filename, content);
  }
}
