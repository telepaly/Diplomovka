import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule
} from '@angular/material';
import {ContractComponent} from './components/contract/contract.component';
import {MatSelectModule} from "@angular/material/select";
import {Scenario1BatchedPermission} from "./util/scenarios/BatchedPermissionScenarios/scenario1";
import {Scenario1StakeAll} from "./util/scenarios/StakeAllScenarios/scenario1";
import {StakeAllContractService} from "./util/StakeAllServices/stakeAllContractService";
import {BatchedPermissionContractService} from "./util/BatchedPermissionServices/batchedPermissionContractService";
import {Web3Service} from "./util/web3.service";
import {MatDividerModule} from "@angular/material/divider";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {SingleLevelAuthContractService} from "./util/SingleLevelAuthServices/singleLevelAuthContractService";
import {MultiLevelAuthContractService} from "./util/MultiLevelAuthServices/multiLevelAuthContractService";

@NgModule({
  declarations: [
    AppComponent,
    ContractComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatSelectModule,
    MatDividerModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  providers: [Scenario1BatchedPermission, Scenario1StakeAll, StakeAllContractService, BatchedPermissionContractService, Web3Service, SingleLevelAuthContractService, MultiLevelAuthContractService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
