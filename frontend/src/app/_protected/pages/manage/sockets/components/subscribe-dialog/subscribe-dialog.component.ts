
/*
 * Copyright (c) Aista Ltd, 2021 - 2023 info@aista.com, all rights reserved.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralService } from 'src/app/_general/services/general.service';

/**
 * Helper modal dialog to allow user to subscribe to socket messages as published by
 * the backend.
 */
@Component({
  selector: 'app-subscribe-dialog',
  templateUrl: './subscribe-dialog.component.html'
})
export class SubscribeDialogComponent implements OnInit {

  public name: string = '';

  /**
   * Creates an instance of your component.
   *
   * @param dialogRef Needed to be able to close dialog
   * @param data Injected data being message name of message returned as dialog is closed
   */
  constructor(
    private generalService: GeneralService,
    private dialogRef: MatDialogRef<SubscribeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { subscriptionName?: string, subscriptionList?: any }) { }

  ngOnInit() {
    if (this.data.subscriptionName && this.data.subscriptionName !== '') {
      this.name = this.data.subscriptionName;
    }
  }

  /**
   * Invoked when user wants to subscribe to the specified message.
   */
  public connect() {
    if (this.data.subscriptionList && this.data.subscriptionList.length > 0 && this.data.subscriptionList.filter((item: any) => item === this.name).length > 0) {
      this.generalService.showFeedback('You are already subscribing to this messages', 'errorMessage');
      return;
    }
    if (this.name === '') {
      this.generalService.showFeedback('Please give your message a name.', 'errorMessage');
      return;
    }

    // Closing dialog making sure we provide message name to caller.
    this.dialogRef.close(this.name);
  }
}
