/** in this scenario user:

 1. buys tokens

 2. ask for permission

 3. is given permission

 **/

import {Injectable} from "@angular/core";
import {filter} from "rxjs/operators";
import {BatchedPermissionContractService} from "../../BatchedPermissionServices/batchedPermissionContractService";
import {MultiLevelAuthContractService} from "../../MultiLevelAuthServices/multiLevelAuthContractService";

@Injectable()
export class Scenario1BatchedPermission {
  accounts: string[];
  userAddress: string;
  nodeAddress: string;

  constructor(private batchedPermissionService: BatchedPermissionContractService, private multiLevelAuthService: MultiLevelAuthContractService) {
  }

  runScenario(times?: number) {
    this.multiLevelAuthService.contractInitialized.pipe(filter(val => val !== false)).subscribe(() => {
      this.accounts = this.batchedPermissionService.accounts;
      const authContractAddress = "0x0A680622e38586aeD3e882111676D0477860b12D"
      const ownerAddress = "0x8dF45F09BF876825873B66303B52Bd3BFf4c6859"

      /* by default, user address is set to account with index 0 */
      this.userAddress = this.accounts[0];

      /* by default, node address is set to account with index 1 */
      this.nodeAddress = this.accounts[1];


      this.multiLevelAuthService.activateNode(ownerAddress, this.nodeAddress, true,
        () => {
          this.batchedPermissionService.contractInitialized.pipe(filter(val => val !== false)).subscribe(() => {
              this.batchedPermissionService.setAuthService(ownerAddress, authContractAddress,
                () => {
                  for (let i = 0; i < times; i++) {
                    this.batchedPermissionService.buyTokens(this.userAddress, 1000, () => {
                      this.batchedPermissionService.askPermission(this.userAddress, () => {
                        this.batchedPermissionService.permissionResolved(this.nodeAddress, this.userAddress, () => {
                        })
                      })
                    })
                  }
                })
            }
          )
        })
    })
  }
}
