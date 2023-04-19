
/*
 * Copyright (c) Aista Ltd, 2021 - 2023 info@aista.com, all rights reserved.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SQLStudioComponent } from '../sql-studio.component';

const routes: Routes = [
  {
    path: '',
    component: SQLStudioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SqlStudioRoutingModule { }
