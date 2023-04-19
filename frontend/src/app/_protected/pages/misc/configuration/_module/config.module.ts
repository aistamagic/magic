
/*
 * Copyright (c) Aista Ltd, 2021 - 2023 info@aista.com, all rights reserved.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from '../configuration.component';
import { ConfigRoutingModule } from './config.routing.module';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { CmModule } from 'src/app/codemirror/_module/cm.module';
import { MaterialModule } from 'src/app/material.module';
import { ComponentsModule } from 'src/app/_general/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SmtpDialogComponent } from '../components/smtp-dialog/smtp-dialog.component';

@NgModule({
  declarations: [
    ConfigurationComponent,
    SmtpDialogComponent,
  ],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    ComponentsModule,
    MaterialModule,
    CmModule,
    CodemirrorModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ConfigModule { }
