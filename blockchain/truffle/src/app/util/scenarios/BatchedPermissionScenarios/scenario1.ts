/** in this scenario user:

 1. buys tokens

 2. ask for permission

 3. is given permission

 **/

export interface Scenario {
  runner: (service: any, userAddress: string, nodeAddress: string, callback?: () => void) => void;
  getInfo: () => string
}

export class Scenario1BatchedPermission implements Scenario {
  constructor() {
  }

  runner(service, userAddress: string, nodeAddress: string, callback: () => void = () => {
  }) {
    service.buyTokens(userAddress, 1, () => {
      service.askPermission(userAddress, () => {
        service.permissionResolved(nodeAddress, userAddress, callback)
      })
    })
  }

  getInfo() {
    return "in this scenario user:\n" +
      "\n" +
      " 1. buys tokens\n" +
      "\n" +
      " 2. ask for permission\n" +
      "\n" +
      " 3. is given permission"
  }
}
