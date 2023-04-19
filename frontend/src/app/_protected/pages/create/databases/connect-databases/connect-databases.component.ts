
/*
 * Copyright (c) Aista Ltd, 2021 - 2023 info@aista.com, all rights reserved.
 */

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/_general/components/confirmation-dialog/confirmation-dialog.component';
import { GeneralService } from 'src/app/_general/services/general.service';
import { BackendService } from 'src/app/_general/services/backend.service';
import { CatalogNameComponent } from './components/catalog-name/catalog-name.component';
import { ManageCatalogsComponent } from './components/manage-catalogs/manage-catalogs.component';
import { SqlService } from '../../../../../_general/services/sql.service';
import { DiagnosticsService } from '../../../../../_general/services/diagnostics.service';
import { ConfigService } from '../../../../../_general/services/config.service';
import { CommonErrorMessages } from 'src/app/_general/classes/common-error-messages';
import { CommonRegEx } from 'src/app/_general/classes/common-regex';
import { MagicResponse } from 'src/app/_general/models/magic-response.model';

/**
 * Helper component allowing user to connect to existing database, and/or create new catalogs
 * in existing databases.
 */
@Component({
  selector: 'app-connect-databases',
  templateUrl: './connect-databases.component.html',
  styleUrls: ['./connect-databases.component.scss']
})
export class ConnectComponent implements OnInit {

  private configFile: any = {};

  dbTypes: any = [
    {name: 'MySQL', type: 'mysql'},
    {name: 'PostgreSQL', type: 'pgsql'},
    {name: 'SQL Server', type: 'mssql'},
  ];

  databaseType: string = 'mysql';
  connectionString: string = '';
  cStringName: string = '';
  databases: any = [];
  waitingTest: boolean = false;
  displayedColumns: string[] = ['dbType', 'cStringName', 'cString', 'status', 'actions'];

  isLoading: boolean = true;
  ip_address: string = 'unknown';

  CommonRegEx = CommonRegEx;
  CommonErrorMessages = CommonErrorMessages;

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private sqlService: SqlService,
    private clipboard: Clipboard,
    private diagnosticService: DiagnosticsService,
    private configService: ConfigService,
    private generalService: GeneralService) { }

  ngOnInit() {

    this.loadConfig();
    this.getIPAddress();
  }

  copyConnectionString(element: any) {

    this.clipboard.copy(element.cString);
    this.generalService.showFeedback('Connection string can be found on your clipboard');
  }

  copyIpAddress() {

    this.clipboard.copy(this.ip_address);
    this.generalService.showFeedback('Cloudlet\'s IP address can be found on your clipboard');
  }

  testConnectionString(connectAfterTesting: boolean) {

    // Sanity checking input
    if (this.cStringName === '' || this.connectionString === '') {
      this.generalService.showFeedback('Please provide both connection name and string', 'errorMessage');
      return;
    }

    if (!this.connectionString.includes('{database}')) {
      this.generalService.showFeedback('Your connection string must have a {database} part', 'errorMessage');
      return;
    }

    if (!this.CommonRegEx.appNameWithUppercase.test(this.cStringName)) {
      this.generalService.showFeedback(this.CommonErrorMessages.appNameWithUppercase, 'errorMessage');
      return;
    }

    if (this.configFile.databases[this.databaseType]?.[this.cStringName]) {
      this.generalService.showFeedback('A connection string with that name already exists', 'errorMessage');
      return;
    }

    if (connectAfterTesting && this.cStringName === 'generic') {

      // Asking user if he wants to use this connection string as his or her default connection string.
      this.dialog.open(ConfirmationDialogComponent, {
        width: '500px',
        data: {
          title: 'Use as default database?',
          description: 'Do you want to use this connection string as your default database and connection string?',
          action_btn: 'Yes',
          close_btn: 'No',
        }
      }).afterClosed().subscribe((result: string) => {
        if (result === 'confirm') {
          this.testConnectionStringImplementation(connectAfterTesting, true);
          return;
        }
        this.testConnectionStringImplementation(connectAfterTesting);
      });
      return;
    }

    this.testConnectionStringImplementation(connectAfterTesting);
  }

  deleteConnectionString(item: any) {

    this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Delete connection string',
        description_extra: `You are deleting the following ${item.dbType} connection string: <br/> <span class="fw-bold">${item.cStringKey}</span>.<br/><br/>Do you want to continue?`,
        action_btn: 'Delete',
        action_btn_color: 'warn',
        bold_description: true,
        extra: {
          details: item,
          action: 'confirmInput',
          fieldToBeTypedTitle: `connection string's name`,
          fieldToBeTypedValue: item.cStringKey,
          icon: 'conversion_path',
        }
      }
    }).afterClosed().subscribe((result: string) => {
      if (result === 'confirm') {
        item.isClicked = true;
        this.sqlService.deleteConnectionString(item.dbTypeValue, item.cStringKey).subscribe({
          next: () => {

            item.isClicked = false;
            this.generalService.showFeedback('Connection string was deleted', 'successMessage');
            this.databases = this.databases.filter((el: any) => item !== el);
          },
          error: (error: any) => {

            item.isClicked = false;
            this.generalService.showFeedback(error?.error?.message ?? error, 'errorMessage')
          }
        });
      }
    });
  }

  createCatalog(item: any) {

    this.dialog.open(CatalogNameComponent, {
      width: '500px',
      data: item
    });
  }

  manageCatalogs(item: any) {

    item.isClicked = true;
    this.generalService.showLoading();

    this.sqlService.getDatabaseMetaInfo(item.dbTypeValue, item.cStringKey).subscribe({
      next: (res: any) => {

        if (res) {
          this.dialog.open(ManageCatalogsComponent, {
            width: '800px',
            data: {
              list: res.databases,
              item: item
            }
          })
        } else {
          this.generalService.showFeedback('No database was found.', null, 'Ok', 4000);
        }
        item.isClicked = false;
        this.generalService.hideLoading();
      },
      error: (error: any) => {

        this.generalService.showFeedback(error?.error?.message ?? error, 'errorMessage');
        item.isClicked = false;
        this.generalService.hideLoading();
      }
    });
  }

  /*
   * Private helper methods
   */

  private testConnectionStringImplementation(connectAfterTesting: boolean, useAsDefault: boolean = false) {

    this.generalService.showLoading();
    this.waitingTest = true;

    this.configService.testConnectionString(this.databaseType, this.connectionString).subscribe({
      next: (res: any) => {

        if (res.result === 'success') {
          if (connectAfterTesting) {
            this.addConnectionString(useAsDefault);
            return;
          }
          this.waitingTest = false;
          this.generalService.showFeedback('Success', 'successMessage');
          this.generalService.hideLoading();

        } else if (res.result === 'failure') {

          this.waitingTest = false;
          this.generalService.showFeedback(res.message, 'errorMessage', 'Ok', 5000);
          this.generalService.hideLoading();
        }
      },
      error: (error: any) => {

        this.waitingTest = false;
        this.generalService.showFeedback(error?.error?.message ?? error, 'errorMessage');
        this.generalService.hideLoading();
      },
    });
  }

  private getIPAddress() {

    this.diagnosticService.getSystemReport().subscribe({
      next: (result: any) => {
        this.ip_address = result.server_ip || 'unknown';
        this.cdr.detectChanges();
      },
      error: (error: any) => this.generalService.showFeedback(error?.error?.message ?? error, 'errorMessage')
    });
  }

  private loadConfig() {

    this.configService.loadConfig().subscribe({
      next: (res: any) => {
        this.configFile = res.magic;

        let databases: any = [];
        this.dbTypes.forEach((type: any) => {
          for (const key in this.configFile.databases[type.type]) {
            databases.push({
              dbType: type.name,
              dbTypeValue: type.type,
              cString: this.configFile.databases[type.type][key],
              status: 'testing ...',
              cStringKey: key,
              isClicked: false
            });
            this.databases = [...databases];
          }
        });
        this.isLoading = false;
        this.getStatus();
      },
      error: (error: any) => this.generalService.showFeedback(error?.error?.message ?? error, 'errorMessage')
    });
  }

  private getStatus() {

    this.databases.forEach((element: any) => {
      this.configService.testConnectionString(element.dbTypeValue, element.cString).subscribe({
        next: (res: MagicResponse) => {
          if (res.result === 'failure') {
            element.status = 'Down';
          } else {
            element.status = 'Live';
          }
        },
        error: () => {
          element.status = 'Down';
        }
      })
    });
  }

  private addConnectionString(useAsDefault: boolean = false) {

    this.sqlService.addConnectionString(
      this.databaseType,
      this.cStringName,
      this.connectionString,
      useAsDefault).subscribe({
      next: () => {

        this.generalService.showFeedback('Successfully connected to database', 'successMessage');
        this.waitingTest = false;
        this.databases = [...this.databases, {
          dbType: this.dbTypes.find((db: any) => db.type === this.databaseType).name,
          dbTypeValue: this.databaseType,
          cString: this.connectionString,
          status: 'Live',
          cStringKey: this.cStringName,
          isClicked: false
        }];

        this.generalService.hideLoading();
        this.cdr.detectChanges();
        this.cStringName = '';
        this.connectionString = '';

      },
      error: (error: any) => {
        this.waitingTest = false;
        this.generalService.showFeedback(error?.error?.message ?? error, 'errorMessage')
      }
    });
  }
}
