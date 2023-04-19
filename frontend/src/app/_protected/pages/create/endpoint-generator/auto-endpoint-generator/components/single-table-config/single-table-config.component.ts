
/*
 * Copyright (c) Aista Ltd, 2021 - 2023 info@aista.com, all rights reserved.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ColumnEx } from 'src/app/_general/models/column-ex.model';

/**
 * Helper component to configure DRUD generator for a single table.
 */
@Component({
  selector: 'app-single-table-config',
  templateUrl: './single-table-config.component.html',
  styleUrls: ['./single-table-config.component.scss']
})
export class SingleTableConfigComponent implements OnInit {

  @Input() selectedTable: string = '';
  @Input() selectedDatabase: string = '';
  @Input() databases: any = [];

  displayedColumns: string[] = [
    'name',
    'type',
    'key',
    'default',
    'template',
    'create',
    'read',
    'update',
    'delete'
  ];
  dataSource: any = [];

  public foreign_keys: any[] = [];

  public templateList: any = TemplateList;

  fkLong: any = {}

  ngOnInit() {

    this.watchDbLoading();
  }

  hasForeignKey(el: any) {

    const list = this.foreign_keys.filter(x => x.column === el.name);
    if (list.length === 0) {
      return false;
    }
    return true;
  }

  private watchDbLoading() {

    this.dataSource = [];
    const db: any = this.databases.find((db: any) => db.name === this.selectedDatabase);
    const table: any = db.tables.find((table: any) => table.name === this.selectedTable.toString());

    this.foreign_keys = table.foreign_keys || [];

    const columns = (table.columns || []);

    this.dataSource = table.columns;

    for (const idxColumn of columns) {

      idxColumn.post = !(idxColumn.automatic && idxColumn.primary);
      if (idxColumn.automatic && idxColumn.name?.toLowerCase() === 'created') {
        idxColumn.post = false;
      }
      idxColumn.get = true;
      idxColumn.put = !idxColumn.automatic || idxColumn.primary;
      idxColumn.delete = idxColumn.primary;

      idxColumn.postDisabled = false;
      idxColumn.getDisabled = false;
      idxColumn.putDisabled = idxColumn.primary;
      idxColumn.deleteDisabled = true;

      if ((idxColumn.name === 'user' || idxColumn.name === 'username') && idxColumn.hl === 'string') {
        idxColumn.locked = true;
      }

      if (idxColumn.name?.toLowerCase() === 'picture' || idxColumn.name?.toLowerCase() === 'image' || idxColumn.name?.toLowerCase() === 'photo') {
        idxColumn.handling = 'image';
      }

      if (idxColumn.name?.toLowerCase() === 'file') {
        idxColumn.handling = 'file';
      }

      if (idxColumn.name?.toLowerCase() === 'youtube' || idxColumn.name?.toLowerCase() === 'video') {
        idxColumn.handling = 'youtube';
      }

      if (idxColumn.name?.toLowerCase() === 'email' || idxColumn.name?.toLowerCase() === 'mail') {
        idxColumn.handling = 'email';
      }

      if (idxColumn.name?.toLowerCase() === 'url' || idxColumn.name?.toLowerCase() === 'link') {
        idxColumn.handling = 'url';
      }

      if (idxColumn.name?.toLowerCase() === 'phone' || idxColumn.name?.toLowerCase() === 'tel') {
        idxColumn.handling = 'phone';
      }
    }
  }

  getForeignKeyName(el: any) {

    const db: any = this.databases.find((db: any) => db.name === this.selectedDatabase);
    const table: any = db.tables.find((table: any) => table.name === this.selectedTable.toString());
    const column: any = table.columns.find((column: any) => column.name === el.name);
    return column.foreign_key ? column.foreign_key.foreign_table + '.' + column.foreign_key.foreign_name : '[none]';
  }

  changeForeignKey(event: any) {

    const db: any = this.databases.find((db: any) => db.name === this.selectedDatabase);
    const table: any = db.tables.find((table: any) => table.name === this.selectedTable.toString());
    const column: any = table.columns.find((column: any) => column.name === event.columnName);
    column.foreign_key = event.selectedForeignKey;
    this.fkLong[event.columnName] = column.foreign_key.long_data;
  }

  verbForColumnIsDisabled(verb: string, column: ColumnEx) {

    switch (verb) {

      case 'post':
        return column.postDisabled;

      case 'get':
        return column.getDisabled;

      case 'put':
        return column.putDisabled;

      case 'delete':
        return column.deleteDisabled;
    }
  }

  changeTemplate(el: any, item: any) {
    if (item.key === 'locked') {
      el.locked = true;
      delete el.handling;
    } else {
      delete el.locked;
      el.handling = item.key
    }
  }

  getTemplateTooltip(name: string) {
    return TemplateListTooltip[name];
  }
}

const TemplateList: any = {
  'textarea': 'Long text',
  'image': 'Image',
  'file': 'File',
  'email': 'Email',
  'url': 'URL',
  'youtube': 'YouTube',
  'phone': 'Phone',
  'username_lookup': 'Username lookup',
  'locked': 'Locked',
}

const TemplateListTooltip: any = {
  'textarea': 'Field will be treated as a multi line textarea when generating a frontend',
  'image': 'Field will be treated as a database stored image when generating a frontend allowing the user to upload an image to the field',
  'file': 'Field will be treated as a database stored file when generating a frontend allowing the user to upload a file to the field',
  'email': 'Field will be treated as an email address and result in an email hyperlink when generating a frontend',
  'url': 'Field will be treated as a URL and result in a hyperlink when generating a frontend',
  'youtube': 'Field will be treated as a YouTube video and embedded as a video when generating a frontend',
  'phone': 'Field will be treated as a phone number when generating a frontend and result in a phone hyperlink when generating a frontend',
  'username_lookup': 'Field will be treated as a username, and result in a username lookup component when generating a frontend',
  'locked': 'Field will be locked to the currently authenticated username, applying row level security',
}
