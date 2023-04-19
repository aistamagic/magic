
/*
 * Copyright (c) Aista Ltd, 2021 - 2023 info@aista.com, all rights reserved.
 */

import { Component } from '@angular/core';
import { ThemeService } from 'src/app/_general/services/theme.service';

/**
 * Dialog to allow user to configure his or her theme the first time the dashboard is opened.
 */
@Component({
  selector: 'app-configure-theme-dialog',
  templateUrl: './configure-theme-dialog.component.html'
})
export class ConfigureThemeDialog {

  constructor(public themeService: ThemeService) { }
}
