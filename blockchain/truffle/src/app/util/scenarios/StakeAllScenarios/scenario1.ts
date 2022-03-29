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
import {MultiLevelAuthContractService} from "../../MultiLevelAuthServices/multiLevelAuthContractService";

@Injectable()
export class Scenario1StakeAll {
  accounts: string[];
  userAddress: string;
  nodeAddress: string;

  constructor(private stakeAllService: StakeAllContractService, private multiLevelAuthService: MultiLevelAuthContractService) {
  }

  runScenario(times: number = 1) {
    if (times < 1) return;

    this.multiLevelAuthService.contractInitialized.pipe(filter(val => val !== false)).subscribe(() => {
      this.accounts = this.stakeAllService.accounts;
      const authContractAddress = "0x0A680622e38586aeD3e882111676D0477860b12D"
      const ownerAddress = "0x8dF45F09BF876825873B66303B52Bd3BFf4c6859"

      /* by default, user address is set to account with index 0 */
      this.userAddress = this.accounts[0];

      /* by default, node address is set to account with index 1 */
      this.nodeAddress = this.accounts[1];

      this.multiLevelAuthService.activateNode(ownerAddress, this.nodeAddress, true,
        () => {
          this.stakeAllService.contractInitialized.pipe(filter(val => val !== false)).subscribe(() => {
            this.stakeAllService.setAuthService(ownerAddress, authContractAddress,
              () => {
                for (let i = 0; i <= times; i++) {
                  this.stakeAllService.buyTokens(this.userAddress, 1)
                }
              })
          })
        })
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
