import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Web3Service} from './web3.service';
import {StakeAllContractService} from "./StakeAllServices/stakeAllContractService";
import {Scenario1StakeAllContract} from "./scenarios/StakeAllScenarios/scenario1";
import {Scenario1BatchedPermission} from "./scenarios/BatchedPermissionScenarios/scenario1";
import {BatchedPermissionContractService} from "./BatchedPermissionServices/batchedPermissionContractService";
import {MultiLevelAuthContractService} from "./MultiLevelAuthServices/multiLevelAuthContractService";
import {SingleLevelAuthContractService} from "./SingleLevelAuthServices/singleLevelAuthContractService";
import {AccountsService} from "./accountsService";
import {ScenarioRunner} from "./scenarioRunner";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    Web3Service,
    StakeAllContractService,
    BatchedPermissionContractService,
    Scenario1StakeAllContract,
    Scenario1BatchedPermission,
    MultiLevelAuthContractService,
    SingleLevelAuthContractService,
    AccountsService,
    ScenarioRunner
  ],
  declarations: [],
})
export class UtilModule {
}
