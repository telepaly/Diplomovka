import {Injectable} from "@angular/core";
import {Web3Service} from "../web3.service";
import {BehaviorSubject} from "rxjs";

const simpleAuthContract_artifacts = require('../../../../build/contracts/SimpleAuthContract.json');

@Injectable()
export class StakeAllContractService {
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
    this.web3Service.initializeContract(simpleAuthContract_artifacts)
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

  public authentificate(fromAddress: string, baseStationAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.contractInstance.methods.askPermission(baseStationAddress).send({
        from: fromAddress,
        gas: 470000,
        gasPrice: 1
      }).then(() => {
        this.isWaiting.next(false);
        console.log("Permission asked");
        if (callback) callback();
      });
    }
  }

  public askPermissionRemoval(fromAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.contractInstance.methods.askPermissionRemoval().send({
        from: fromAddress,
        gas: 470000,
        gasPrice: 1
      }).then(() => {
        this.isWaiting.next(false);
        console.log("Permission removal asked");
        if (callback) callback();
      });
    }
  }

  public removePermission(fromAddress: string, baseStationAddress: string, amount: number, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.contractInstance.methods.removePermission(baseStationAddress, amount).send({
        from: fromAddress,
        gas: 470000,
        gasPrice: 1
      }).then(() => {
        this.isWaiting.next(false);
        console.log("Permission removed");
        if (callback) callback();
      });
    }
  }

  public approve(fromAddress: string, userAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.contractInstance.methods.approve(userAddress).send({
        from: fromAddress,
        gas: 470000,
        gasPrice: 1,
      }).then(() => {
        this.isWaiting.next(false);
        console.log("Permission approved");
        if (callback) callback();
      });
    }
  }

  public decline(fromAddress: string, userAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.contractInstance.methods.decline(userAddress).send({
        from: fromAddress,
        gas: 470000,
        gasPrice: 1,
      }).then(() => {
        this.isWaiting.next(false);
        console.log("Permission declined");
        if (callback) callback();
      });
    }
  }

  public getUserStatus(userAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.contractInstance.methods.getUserStatus(userAddress).call().then((result) => {
        if (callback) callback();
        this.isWaiting.next(false);
        console.log(result);
      });
    }
  }

  public getBalance(callback?: () => {}): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.contractInstance.methods.getBalance().call().then((result) => {
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
