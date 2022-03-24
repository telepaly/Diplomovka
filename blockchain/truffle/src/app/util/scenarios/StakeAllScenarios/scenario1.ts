/** in this scenario user:

 1. buys tokens

 2. ask for permission

 3. is given permission

 4. ask for permission removal

 5. permission is removed

 **/

import {StakeAllContractService} from "../../StakeAllServices/stakeAllContractService";
import {Injectable} from "@angular/core";
import {filter} from "rxjs/operators";

@Injectable()
export class Scenario1StakeAll {
  accounts: string[];
  userAddress: string;
  nodeAddress: string;

  constructor(private stakeAllService: StakeAllContractService) {
  }

  runScenario(times: number = 1) {
    if (times < 1) return;
    this.stakeAllService.contractInitialized.pipe(filter(val => val !== false)).subscribe(() => {
      this.accounts = this.stakeAllService.accounts;


      /* by default, user address is set to account with index 0 */
      this.userAddress = this.accounts[0];
      // this.userAddress = "0xfd4e8f1efdfbf5fbc4a2461aa8f0b2307b2a592e";

      /* by default, node address is set to account with index 1 */
      this.nodeAddress = this.accounts[1];
      // this.nodeAddress = "0x8d31a7fb12aea40bf0e84b362f39dfd70ed98dd0";
      // let i = 0;
      for (let i = 0; i <= times; i++) {
        this.stakeAllService.buyTokens(this.userAddress, 1)
      }
    })
  }

  run(times: number) {
    if (times < 1) return;
    for (let i = 0; i < times - 1; i++) {
      this.stakeAllService.askPermission(this.userAddress, this.nodeAddress, () => {
        this.stakeAllService.approve(this.nodeAddress, this.userAddress, () => {
          this.stakeAllService.askPermissionRemoval(this.userAddress, () => {
            this.stakeAllService.removePermission(this.nodeAddress, this.userAddress, 800, () => {
              this.run(times - 1);
            })
          })
        })
      })
    }
  }

}
