/** in this scenario user:

 1. buys tokens

 2. ask for permission

 3. is given permission

 **/

import {Injectable} from "@angular/core";
import {filter} from "rxjs/operators";
import {BatchedPermissionContractService} from "../../BatchedPermissionServices/batchedPermissionContractService";

@Injectable()
export class Scenario1BatchedPermission {
  accounts: string[];
  userAddress: string;
  nodeAddress: string;

  constructor(private batchedPermissionService: BatchedPermissionContractService) {
  }

  runScenario(times?: number) {
    this.batchedPermissionService.contractInitialized.pipe(filter(val => val !== false)).subscribe(() => {
      this.accounts = this.batchedPermissionService.accounts;
      /* by default, user address is set to account with index 0 */
      this.userAddress = this.accounts[0];

      /* by default, node address is set to account with index 1 */
      this.nodeAddress = this.accounts[1];

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
}
