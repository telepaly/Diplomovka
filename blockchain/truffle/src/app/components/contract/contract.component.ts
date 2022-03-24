import {Component, OnInit} from '@angular/core';
import {Scenario1BatchedPermission} from "../../util/scenarios/BatchedPermissionScenarios/scenario1";
import {Scenario1StakeAll} from "../../util/scenarios/StakeAllScenarios/scenario1";
import {FormControl} from "@angular/forms";
import {BatchedPermissionContractService} from "../../util/BatchedPermissionServices/batchedPermissionContractService";
import {StakeAllContractService} from "../../util/StakeAllServices/stakeAllContractService";
import {skip} from "rxjs/operators";

const ASYNC_OFF = 'async calls OFF';
const LOGS_OFF = 'logs OFF';
const ASYNC_ON = 'async calls ON';
const LOGS_ON = 'logs ON';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})

export class ContractComponent implements OnInit {
  accounts: string[];
  contract: any;
  stakeAll: any;
  toggle1;
  logsToggle1;
  toggle2;
  logsToggle2;
  toggle1Title;
  logsToggle1Title;
  toggle2Title;
  logsToggle2Title;
  textArea1Logs: string = '';
  textArea2Logs: string = '';

  constructor(
    private scenario1BatchedPermission: Scenario1BatchedPermission,
    private scenario1StakeAll: Scenario1StakeAll,
    private batchedPermissionService: BatchedPermissionContractService,
    private stakeAllService: StakeAllContractService
  ) {
    this.toggle1 = new FormControl(false, []);
    this.toggle2 = new FormControl(false, []);
    this.logsToggle1 = new FormControl(true, []);
    this.logsToggle2 = new FormControl(true, []);
    this.toggle1Title = ASYNC_OFF;
    this.toggle2Title = ASYNC_OFF;
    this.logsToggle1Title = LOGS_OFF;
    this.logsToggle2Title = LOGS_ON;
  }

  ngOnInit(): void {
    this.subscribeToToggle1Change();
    this.subscribeToToggle2Change();
    this.subscribeToLogsToggle1Change();
    this.subscribeToLogsToggle2Change();
    this.subscribeToBatchedPermissionContractLogs();
    this.subscribeToStakeAllContractLogs();
  };

  subscribeToToggle1Change() {
    this.toggle1.valueChanges.subscribe(val => {
      this.toggle1Title = val ? ASYNC_ON : ASYNC_OFF;
      this.batchedPermissionService.setIsAsymetric(val);
    });
  }

  subscribeToLogsToggle1Change() {
    this.logsToggle1.valueChanges.subscribe(val => {
      this.logsToggle1Title = val ? LOGS_ON : LOGS_OFF;
      this.batchedPermissionService.loggingService.setLoggingOn(val);
    });
  }

  subscribeToToggle2Change() {
    this.toggle2.valueChanges.subscribe(val => {
      this.toggle2Title = val ? ASYNC_ON : ASYNC_OFF;
      this.stakeAllService.setIsAsymetric(val);
    });
  }

  subscribeToLogsToggle2Change() {
    this.logsToggle2.valueChanges.subscribe(val => {
      this.logsToggle2Title = val ? LOGS_ON : LOGS_OFF;
      this.stakeAllService.loggingService.setLoggingOn(val);
    });
  }

  subscribeToBatchedPermissionContractLogs() {
    this.batchedPermissionService.loggingService.getLogsSubject().pipe(skip(1)).subscribe((logValue) => this.textArea1Logs = this.textArea1Logs + logValue + '\n')
  }

  subscribeToStakeAllContractLogs() {
    this.stakeAllService.loggingService.getLogsSubject().pipe(skip(1)).subscribe((logValue) => this.textArea2Logs = this.textArea2Logs + logValue + '\n')
  }

  runScenario1BatchedPermission() {
    this.scenario1BatchedPermission.runScenario(100);
  }

  runScenario1StakeAll() {
    this.scenario1StakeAll.runScenario(1000);
  }

  clearLogs1(){
    this.textArea1Logs = '';
  }

  clearLogs2(){
    this.textArea2Logs = '';
  }
}
