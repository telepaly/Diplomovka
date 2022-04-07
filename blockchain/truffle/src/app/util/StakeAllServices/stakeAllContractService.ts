import {Injectable} from "@angular/core";
import {Web3Service} from "../web3.service";
import {BehaviorSubject} from "rxjs";
import {LoggingService} from "../loggingService";

const stakeAllContract_artifacts = require('../../../../build/contracts/StakeAllContract.json');

@Injectable()
export class StakeAllContractService {
  stakeAllContractInstance: any;
  contractInitialized: BehaviorSubject<boolean>;
  waitingState: BehaviorSubject<boolean>;
  isAsynchronous: boolean;
  loggingService: LoggingService;

  constructor(private web3Service: Web3Service) {
    this.loggingService = new LoggingService();
    this.stakeAllContractInstance = null
    this.contractInitialized = new BehaviorSubject<boolean>(false);
    this.waitingState = new BehaviorSubject<boolean>(false);
    this.initializeContract();
    this.isAsynchronous = false;
  }

  //used to enable/disable asymetric calls

  setIsAsymetric(asymetric: boolean){
    this.isAsynchronous = asymetric;
  }

  setLoggingTurnedOn(turnedOn: boolean){
    this.loggingService.setLoggingOn(turnedOn);
  }

  private initializeContract() {
    this.log("Contract initialization in progress")
    this.setWaiting(true);
    this.web3Service.initializeContract(stakeAllContract_artifacts)
      .then((StakeAllContract) => {
        this.setWaiting(false);
        this.log("Contract initialized")
        this.stakeAllContractInstance = StakeAllContract;
        this.contractInitialized.next(true);
      });
  }

  public buyTokens(fromAddress: string, numberOfTokens: number, callback?: () => void): any {
    if (this.stakeAllContractInstance && this.notInWaitingState()) {
      this.log(`Buying ${numberOfTokens} tokens in progress`);
      this.setWaiting(true);
      this.stakeAllContractInstance.methods.buyTokens(numberOfTokens).send({
        from: fromAddress,
        gas: 2000000,
        gasPrice: 1,
        value: numberOfTokens
      }).then(() => {
        this.setWaiting(false);
        this.log(`${numberOfTokens} tokens bought`);
        if (callback) callback();
      })
    }
  }

  public sellTokens(fromAddress: string, numberOfTokens: number, callback?: () => void): any {
    if (this.stakeAllContractInstance && this.notInWaitingState()) {
      this.log(`Selling ${numberOfTokens} tokens in progress`);
      this.setWaiting(true);
      this.stakeAllContractInstance.methods.sellTokens(numberOfTokens).send({
        from: fromAddress,
        gas: 2000000,
        gasPrice: 1,
        value: numberOfTokens
      }).then(() => {
        this.setWaiting(false);
        this.log(`${numberOfTokens} tokens sold`);
        if (callback) callback();
      });
    }
  }

  public askPermission(fromAddress: string, baseStationAddress: string, callback?: () => void): any {
    if (this.stakeAllContractInstance && this.notInWaitingState()) {
      this.log(`Asking for permission`);
      this.setWaiting(true);
      this.stakeAllContractInstance.methods.askPermission(baseStationAddress).send({
        from: fromAddress,
        gas: 2000000,
        gasPrice: 1
      }).then(() => {
        this.setWaiting(false);
        this.log(`Permission added`);
        if (callback) callback();
      });
    }
  }

  public askPermissionRemoval(fromAddress: string, callback?: () => void): any {
    if (this.stakeAllContractInstance && this.notInWaitingState()) {
      this.log(`Asking for permission removal appliance`);
      this.setWaiting(true);
      this.stakeAllContractInstance.methods.askPermissionRemoval().send({
        from: fromAddress,
        gas: 2000000,
        gasPrice: 1
      }).then(() => {
        this.setWaiting(false);
        this.log("Permission removal applied");
        if (callback) callback();
      });
    }
  }

  public removePermission(fromAddress: string, baseStationAddress: string, amount: number, callback?: () => void): any {
    if (this.stakeAllContractInstance && this.notInWaitingState()) {
      this.log(`Asking for permission removal`);
      this.setWaiting(true);
      this.stakeAllContractInstance.methods.removePermission(baseStationAddress, amount).send({
        from: fromAddress,
        gas: 2000000,
        gasPrice: 1
      }).then(() => {
        this.setWaiting(false);
        this.log("Permission removed");
        if (callback) callback();
      });
    }
  }

  public approve(fromAddress: string, userAddress: string, callback?: () => void): any {
    if (this.stakeAllContractInstance && this.notInWaitingState()) {
      this.log(`Asking for permission approval`);
      this.setWaiting(true);
      this.stakeAllContractInstance.methods.approve(userAddress).send({
        from: fromAddress,
        gas: 2000000,
        gasPrice: 1,
      }).then(() => {
        this.setWaiting(false);
        this.log("Permission approved");
        if (callback) callback();
      });
    }
  }

  public decline(fromAddress: string, userAddress: string, callback?: () => void): any {
    if (this.stakeAllContractInstance && this.notInWaitingState()) {
      this.log(`Asking for permission decline`);
      this.setWaiting(true);
      this.stakeAllContractInstance.methods.decline(userAddress).send({
        from: fromAddress,
        gas: 2000000,
        gasPrice: 1,
      }).then(() => {
        this.setWaiting(false);
        this.log("Permission declined");
        if (callback) callback();
      });
    }
  }

  public setAuthService(fromAddress: string, serviceAddress: string, callback?: () => void): any {
    if (this.stakeAllContractInstance && this.notInWaitingState()) {
      this.log("Setting auth address");
      this.setWaiting(true);
      this.stakeAllContractInstance.methods.setAuthService(serviceAddress).send({
        from: fromAddress,
        gas: 470000,
        gasPrice: 1
      }).then(() => {
        this.setWaiting(false);
        this.log("Auth address set");
        if (callback) callback();
      });
    }
  }

  public getUserStatus(userAddress: string, callback?: () => void): any {
    if (this.stakeAllContractInstance && this.notInWaitingState()) {
      this.log(`Asking for user status`);
      this.setWaiting(true);
      this.stakeAllContractInstance.methods.getUserStatus(userAddress).call().then((result) => {
        this.log(`User status received`);
        if (callback) callback();
        this.setWaiting(false);
      });
    }
  }

  public getBalance(callback?: () => {}): any {
    if (this.stakeAllContractInstance && this.notInWaitingState()) {
      this.log(`Asking for user balance`);
      this.setWaiting(true);
      this.stakeAllContractInstance.methods.getBalance().call().then((result) => {
        this.setWaiting(false);
        this.log(`User balance received`);
        if (callback) callback();
      });
    }
  }

  notInWaitingState(): boolean {
    return !this.waitingState.getValue() || this.isAsynchronous;
  }

  setWaiting(waiting: boolean){
    this.waitingState.next(waiting)
  }

  log(message: string){
    this.loggingService.logInfo(message);
  }
}
