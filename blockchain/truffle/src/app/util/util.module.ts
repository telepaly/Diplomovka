import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Web3Service} from './web3.service';
import {StakeAllContractService} from "./StakeAllServices/stakeAllContractService";
import {Scenario1StakeAll} from "./scenarios/StakeAllScenarios/scenario1";
import {Scenario1BatchedPermission} from "./scenarios/BatchedPermissionScenarios/scenario1";
import {BatchedPermissionContractService} from "./BatchedPermissionServices/batchedPermissionContractService";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    Web3Service,
    StakeAllContractService,
    BatchedPermissionContractService,
    Scenario1StakeAll,
    Scenario1BatchedPermission
  ],
  declarations: [],
})
export class UtilModule {
}
