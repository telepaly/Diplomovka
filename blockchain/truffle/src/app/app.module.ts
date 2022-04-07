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
import {Scenario1StakeAllContract} from "./util/scenarios/StakeAllScenarios/scenario1";
import {StakeAllContractService} from "./util/StakeAllServices/stakeAllContractService";
import {BatchedPermissionContractService} from "./util/BatchedPermissionServices/batchedPermissionContractService";
import {Web3Service} from "./util/web3.service";
import {MatDividerModule} from "@angular/material/divider";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {SingleLevelAuthContractService} from "./util/SingleLevelAuthServices/singleLevelAuthContractService";
import {MultiLevelAuthContractService} from "./util/MultiLevelAuthServices/multiLevelAuthContractService";
import {AccountsService} from "./util/accountsService";
import {ScenarioRunner} from "./util/scenarioRunner";
import {MatTabsModule} from "@angular/material/tabs";
import {MatRadioModule} from "@angular/material/radio";
import {MatTableModule} from "@angular/material/table";

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
    MatTabsModule,
    MatRadioModule,
    MatTableModule,
  ],
  providers: [
    Scenario1BatchedPermission,
    Scenario1StakeAllContract,
    StakeAllContractService,
    BatchedPermissionContractService,
    Web3Service,
    SingleLevelAuthContractService,
    MultiLevelAuthContractService,
    AccountsService,
    ScenarioRunner
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
