/** in this scenario user:

 1. buys tokens

 2. ask for permission

 3. is given permission

 4. ask for permission removal

 5. permission is removed

 **/
import {Scenario} from "../BatchedPermissionScenarios/scenario1";

export class Scenario1StakeAllContract implements Scenario{
  constructor() {}

  runner(service, userAddress: string, nodeAddress: string, callback: () => void = () => {
  }) {
    service.buyTokens(userAddress, 1, () => {
      service.askPermission(userAddress, nodeAddress, () => {
        service.approve(nodeAddress, userAddress, () => {
          service.askPermissionRemoval(userAddress, () => {
            service.removePermission(nodeAddress, userAddress, 1, callback)
            })
          })
        })
      }
    )
  }

  getInfo(){
    return "in this scenario user:\n" +
      "\n" +
      " 1. buys tokens\n" +
      "\n" +
      " 2. ask for permission\n" +
      "\n" +
      " 3. is given permission\n" +
      "\n" +
      " 4. ask for permission removal\n" +
      "\n" +
      " 5. permission is removed"
  }
}
