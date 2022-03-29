import {Injectable} from "@angular/core";
import {Web3Service} from "../web3.service";
import {BehaviorSubject} from "rxjs";
import {LoggingService} from "../loggingService";

const stakeAllContract_artifacts = require('../../../../build/contracts/StakeAllContract.json');

@Injectable()
export class StakeAllContractService {
  contractInstance: any;
  contractInitialized: BehaviorSubject<boolean>;
  isWaiting: BehaviorSubject<boolean>;
  contractName: BehaviorSubject<string>;
  web3: any;
  accounts: string[];
  isAsymetric: boolean;
  loggingService: LoggingService;

  constructor(private web3Service: Web3Service) {
    this.loggingService = new LoggingService();
    this.contractInstance = null
    this.contractInitialized = new BehaviorSubject<boolean>(false);
    this.isWaiting = new BehaviorSubject<boolean>(false);
    this.initializeContract();
    this.isAsymetric = false;
  }

  //used to enable/disable asymetric calls

  setIsAsymetric(asymetric: boolean){
    this.isAsymetric = asymetric;
  }

  setLoggingTurnedOn(turnedOn: boolean){
    this.loggingService.setLoggingOn(turnedOn);
  }

  private initializeContract() {
    this.isWaiting.next(true);
    this.loggingService.logInfo("Contract initialization in progress")
    this.web3Service.initializeContract(stakeAllContract_artifacts)
      .then((StakeAllContract) => {
        this.loggingService.logInfo("Contract initialized")
        this.contractInstance = StakeAllContract;
        this.web3 = this.web3Service.getWeb3Instance();
        this.web3.eth.getAccounts().then((accs) => {
          this.accounts = accs;
          this.contractInitialized.next(true);
        })
        this.isWaiting.next(false);
      });
  }

  public buyTokens(fromAddress: string, numberOfTokens: number, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.loggingService.logInfo(`Buying ${numberOfTokens} tokens in progress`);
      this.contractInstance.methods.buyTokens(numberOfTokens).send({
        from: fromAddress,
        gas: 2000000,
        gasPrice: 1,
        value: numberOfTokens
      }).then(() => {
        this.loggingService.logInfo(`${numberOfTokens} tokens bought`);
        this.isWaiting.next(false);
        console.log("Successfully bought " + numberOfTokens + " tokens.")
        if (callback) callback();
      })

    }
  }

  public sellTokens(fromAddress: string, numberOfTokens: number, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.loggingService.logInfo(`Selling ${numberOfTokens} tokens in progress`);
      this.contractInstance.methods.sellTokens(numberOfTokens).send({
        from: fromAddress,
        gas: 2000000,
        gasPrice: 1,
        value: numberOfTokens
      }).then(() => {
        this.loggingService.logInfo(`${numberOfTokens} tokens sold`);
        this.isWaiting.next(false);
        console.log("Successfully sold " + numberOfTokens + " tokens.")
        if (callback) callback();
      });
    }
  }

  public askPermission(fromAddress: string, baseStationAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.loggingService.logInfo(`Asking for permission`);
      this.contractInstance.methods.askPermission(baseStationAddress).send({
        from: fromAddress,
        gas: 2000000,
        gasPrice: 1
      }).then(() => {
        this.loggingService.logInfo(`Permission added`);
        this.isWaiting.next(false);
        console.log("Permission asked");
        if (callback) callback();
      });
    }
  }

  public askPermissionRemoval(fromAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.loggingService.logInfo(`Asking for permission removal appliance`);
      this.contractInstance.methods.askPermissionRemoval().send({
        from: fromAddress,
        gas: 2000000,
        gasPrice: 1
      }).then(() => {
        this.loggingService.logInfo("Permission removal applied");
        this.isWaiting.next(false);
        console.log("Permission removal asked");
        if (callback) callback();
      });
    }
  }

  public removePermission(fromAddress: string, baseStationAddress: string, amount: number, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.loggingService.logInfo(`Asking for permission removal`);
      this.contractInstance.methods.removePermission(baseStationAddress, amount).send({
        from: fromAddress,
        gas: 2000000,
        gasPrice: 1
      }).then(() => {
        this.loggingService.logInfo("Permission removed");
        this.isWaiting.next(false);
        console.log("Permission removed");
        if (callback) callback();
      });
    }
  }

  public approve(fromAddress: string, userAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.loggingService.logInfo(`Asking for permission approval`);
      this.contractInstance.methods.approve(userAddress).send({
        from: fromAddress,
        gas: 2000000,
        gasPrice: 1,
      }).then(() => {
        this.loggingService.logInfo("Permission approved");
        this.isWaiting.next(false);
        console.log("Permission approved");
        if (callback) callback();
      });
    }
  }

  public decline(fromAddress: string, userAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.loggingService.logInfo(`Asking for permission decline`);
      this.contractInstance.methods.decline(userAddress).send({
        from: fromAddress,
        gas: 2000000,
        gasPrice: 1,
      }).then(() => {
        this.loggingService.logInfo("Permission declined");
        this.isWaiting.next(false);
        console.log("Permission declined");
        if (callback) callback();
      });
    }
  }

  public setAuthService(fromAddress: string, serviceAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.loggingService.logInfo("Setting auth address");
      this.contractInstance.methods.setAuthService(serviceAddress).send({
        from: fromAddress,
        gas: 470000,
        gasPrice: 1
      }).then(() => {
        this.isWaiting.next(false);
        this.loggingService.logInfo("Auth address set");
        if (callback) callback();
      });
    }
  }

  public getUserStatus(userAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.loggingService.logInfo(`Asking for user status`);
      this.contractInstance.methods.getUserStatus(userAddress).call().then((result) => {
        this.loggingService.logInfo(`User status received`);
        if (callback) callback();
        this.isWaiting.next(false);
        console.log(result);
      });
    }
  }

  public getBalance(callback?: () => {}): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.isWaiting.next(true);
      this.loggingService.logInfo(`Asking for user balance`);
      this.contractInstance.methods.getBalance().call().then((result) => {
        this.loggingService.logInfo(`User balance received`);
        if (callback) callback();
        this.isWaiting.next(false);
        console.log(result);
      });
    }
  }

  notInWaitingState(): boolean {
    return !this.isWaiting.getValue() || this.isAsymetric;
  }
}
