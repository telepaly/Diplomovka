import {Component, OnInit} from '@angular/core';
import {Scenario, Scenario1BatchedPermission} from "../../util/scenarios/BatchedPermissionScenarios/scenario1";
import {Scenario1StakeAllContract} from "../../util/scenarios/StakeAllScenarios/scenario1";
import {FormControl, Validators} from "@angular/forms";
import {BatchedPermissionContractService} from "../../util/BatchedPermissionServices/batchedPermissionContractService";
import {StakeAllContractService} from "../../util/StakeAllServices/stakeAllContractService";
import {skip} from "rxjs/operators";
import {ScenarioRunner} from "../../util/scenarioRunner";
import {SingleLevelAuthContractService} from "../../util/SingleLevelAuthServices/singleLevelAuthContractService";
import {MultiLevelAuthContractService} from "../../util/MultiLevelAuthServices/multiLevelAuthContractService";
import {AccountsService} from "../../util/accountsService";

const ASYNC_OFF = 'sync calls';
const LOGS_OFF = 'logs OFF';
const ASYNC_ON = 'async calls';
const LOGS_ON = 'logs ON';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {
  accounts: string[];
  contract: any;
  toggle1;
  numberOfCalls1;
  logsToggle1;
  toggle2;
  numberOfCalls2;
  logsToggle2;
  toggle1Title;
  logsToggle1Title;
  toggle2Title;
  logsToggle2Title;
  textArea1Logs: string = '';
  textArea2Logs: string = '';
  authServices;
  authServiceRadioButton = 0;

  selectedBatchedPermissionScenario = 'scenario1';
  selectedStakeAllScenario = 'scenario1';

  displayedColumns: string[] = ['position', 'name'];
  dataSource = [];
  constructor(
    private scenario1BatchedPermission: Scenario1BatchedPermission,
    private scenario1StakeAll: Scenario1StakeAllContract,
    private batchedPermissionService: BatchedPermissionContractService,
    private stakeAllService: StakeAllContractService,
    private singleLevelAuthService: SingleLevelAuthContractService,
    private multiLevelAuthService: MultiLevelAuthContractService,
    private scenarioRunner: ScenarioRunner,
    public accountsService: AccountsService
  ) {
    this.toggle1 = new FormControl(false, []);
    this.numberOfCalls1 = new FormControl(1, Validators.min(1));
    this.toggle2 = new FormControl(false, []);
    this.numberOfCalls2 = new FormControl(1, Validators.min(1));
    this.logsToggle1 = new FormControl(true, []);
    this.logsToggle2 = new FormControl(true, []);
    this.toggle1Title = ASYNC_OFF;
    this.toggle2Title = ASYNC_OFF;
    this.logsToggle1Title = LOGS_OFF;
    this.logsToggle2Title = LOGS_ON;

    this.authServices = [
      'SingleLevelAuthentication',
      'MultiLevelAuthentication',
    ];
  }

  ngOnInit(): void {
    this.subscribeToToggle1Change();
    this.subscribeToToggle2Change();
    this.subscribeToLogsToggle1Change();
    this.subscribeToLogsToggle2Change();
    this.subscribeToBatchedPermissionContractLogs();
    this.subscribeToStakeAllContractLogs();

    this.accountsService.getAccountsObservable().subscribe(accounts => {
      this.accounts = accounts;
      this.dataSource = this.accounts.map((val, index) => ({name: val, position: index+1}));
    })
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
    if (this.numberOfCalls1.valid && this.selectedBatchedPermissionScenario) this.scenarioRunner.runScenario(
      this.getAuthService(this.authServiceRadioButton),
      this.batchedPermissionService,
      this.numberOfCalls1.value,
      this.getSelectedBatchedPermissionScenario(this.selectedBatchedPermissionScenario)
    );
  }

  runScenario1StakeAll() {
    if (this.numberOfCalls2.valid) this.scenarioRunner.runScenario(
      this.multiLevelAuthService,
      this.stakeAllService,
      this.numberOfCalls2.value,
      this.getSelectedStakeAllScenario(this.selectedStakeAllScenario)
    );
  }

  clearLogs1() {
    this.textArea1Logs = '';
  }

  clearLogs2() {
    this.textArea2Logs = '';
  }

  getAuthService(index){
    return index === 0 ? this.singleLevelAuthService : this.multiLevelAuthService;
  }

  getSelectedBatchedPermissionScenario(value){
    switch(value){
      case 'scenario1': {
        return this.scenario1BatchedPermission;
      }
    }
  }

  getSelectedStakeAllScenario(value){
    switch(value){
      case 'scenario1': {
        return this.scenario1StakeAll;
      }
    }
  }

  getInfo(scenario: Scenario){
    return scenario.getInfo();
  }
}
