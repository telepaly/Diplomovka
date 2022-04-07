import {Injectable} from "@angular/core";
import {filter, take} from "rxjs/operators";
import {AccountsService} from "./accountsService";
import {combineLatest} from "rxjs";
import {Scenario} from "./scenarios/BatchedPermissionScenarios/scenario1";


@Injectable()
export class ScenarioRunner {
  constructor(private accountsService: AccountsService) {
  }

  runScenario(authService, contractService, times: number = 1, scenario: Scenario) {
    if (times < 1 || times > 99) return;
    combineLatest([authService.contractInitialized, this.accountsService.getAccountsObservable()])
      // .pipe(take(1), filter(val => val[0] !== false && val[1].length > 1 && times < val[1].length))
      .pipe(take(1), filter(val => val[0] !== false && val[1].length > 1))
      .subscribe(([, accounts]) => {
        const authContractAddress = authService.contractInstance._address
        const ownerAddress = accounts[0];
        // const nodeAddress = accounts[times];
        const nodeAddress = accounts[1];

        authService.activateNode(ownerAddress, nodeAddress, true,
          () => {
            contractService.contractInitialized.pipe(filter(val => val !== false)).subscribe(() => {
              contractService.setAuthService(ownerAddress, authContractAddress,
                () => {
                  if (contractService.isAsynchronous) {
                    for (let i = 0; i < times; i++) {
                      // const userAddress = accounts[i];
                      const userAddress = accounts[0];
                      scenario.runner(contractService, userAddress, nodeAddress)
                    }
                  } else {
                    const recursion: (i: number) => any = (i) => {
                      if (i < 1) return;
                      const userAddress = accounts[i];
                      scenario.runner(contractService, userAddress, nodeAddress, () => recursion(i - 1))
                    }
                    recursion(times);
                  }
                })
            })
          })
      })
  }
}

