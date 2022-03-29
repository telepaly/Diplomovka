import {Injectable} from "@angular/core";
import {Web3Service} from "../web3.service";
import {BehaviorSubject} from "rxjs";

const SingleLevelAuthContract_artifacts = require('../../../../build/contracts/SingleLevelAuthContract.json');

@Injectable()
export class SingleLevelAuthContractService {
  contractInstance: any;
  contractInitialized: BehaviorSubject<boolean>;
  isWaiting: BehaviorSubject<boolean>;
  contractName: BehaviorSubject<string>;
  web3: any;
  accounts: string[];

  constructor(private web3Service: Web3Service) {
    this.contractInstance = null
    this.contractInitialized = new BehaviorSubject<boolean>(false);
    this.isWaiting = new BehaviorSubject<boolean>(false);
    this.initializeContract();
  }

  private initializeContract() {
    this.isWaiting.next(true);
    this.web3Service.initializeContract(SingleLevelAuthContract_artifacts)
      .then((SimpleAuthContract) => {
        this.contractInstance = SimpleAuthContract;
        this.web3 = this.web3Service.getWeb3Instance();
        this.web3.eth.getAccounts().then((accs) => {
          this.accounts = accs;
          this.contractInitialized.next(true);
        })
        this.isWaiting.next(false);
      });
  }

  public activateNode(fromAddress: string, baseStationAddress: string, activation: boolean, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.contractInstance.methods.activateNode(baseStationAddress, activation).send({
        from: fromAddress,
        gas: 470000,
        gasPrice: 1
      }).then(() => {
        this.isWaiting.next(false);
        console.log("Base Station Activated");
        if (callback) callback();
      });
    }
  }

  public removeNode(fromAddress: string, baseStationAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.contractInstance.methods.removeNode(baseStationAddress).send({
        from: fromAddress,
        gas: 470000,
        gasPrice: 1
      }).then(() => {
        this.isWaiting.next(false);
        console.log("Node removed");
        if (callback) callback();
      });
    }
  }

  public getNodeAuthStatus(userAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.contractInstance.methods.getNodeAuthStatus(userAddress).call().then((result) => {
        if (callback) callback();
        this.isWaiting.next(false);
        console.log(result);
      });
    }
  }

  notInWaitingState(): boolean {
    return this.isWaiting.getValue() !== true;
  }
}
