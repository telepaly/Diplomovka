import {Injectable} from "@angular/core";
import {Web3Service} from "../web3.service";
import {BehaviorSubject} from "rxjs";
import {LoggingService} from "../loggingService";

const batchedPermissionContract_artifacts = require('../../../../build/contracts/BatchedPermissionContract.json');

@Injectable()
export class BatchedPermissionContractService {
  contractInstance: any;
  contractInitialized: BehaviorSubject<boolean>;
  waitingState: BehaviorSubject<boolean>;
  isAsynchronous: boolean;
  loggingService: LoggingService;

  constructor(private web3Service: Web3Service) {
    this.loggingService = new LoggingService();
    this.contractInstance = null
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
    this.web3Service.initializeContract(batchedPermissionContract_artifacts)
      .then((BatchedPermissionContract) => {
        this.setWaiting(false);
        this.log("Contract initialized")
        this.contractInstance = BatchedPermissionContract;
        this.contractInitialized.next(true);
      });
  }

  public buyTokens(fromAddress: string, numberOfTokens: number, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.log(`Buying ${numberOfTokens} tokens in progress`);
      this.setWaiting(true);
      this.contractInstance.methods.buyTokens(numberOfTokens).send({
        from: fromAddress,
        gas: 470000,
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
    if (this.contractInstance && this.notInWaitingState()) {
      this.log(`Selling ${numberOfTokens} tokens in progress`);
      this.setWaiting(true);
      this.contractInstance.methods.sellTokens(numberOfTokens).send({
        from: fromAddress,
        gas: 470000,
        gasPrice: 1,
        value: numberOfTokens
      }).then(() => {
        this.setWaiting(false);
        this.log(`${numberOfTokens} tokens sold`);
        if (callback) callback();
      });
    }
  }

  public askPermission(fromAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.log(`Asking for permission`);
      this.setWaiting(true);
      this.contractInstance.methods.askPermission().send({
        from: fromAddress,
        gas: 470000,
        gasPrice: 1
      }).then(() => {
        this.setWaiting(false);
        this.log(`Permission added`);
        if (callback) callback();
      });
    }
  }

  public permissionResolved(fromAddress: string, userAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.log(`Asking for permission resolving`);
      this.setWaiting(true);
      this.contractInstance.methods.permissionResolved(userAddress).send({
        from: fromAddress,
        gas: 470000,
        gasPrice: 1
      }).then(() => {
        this.setWaiting(false);
        this.log("Permission resolved");
        if (callback) callback();
      });
    }
  }

  public denyPermisson(fromAddress: string, userAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.log(`Asking for permission deny`);
      this.setWaiting(true);
      this.contractInstance.methods.denyPermisson(userAddress).send({
        from: fromAddress,
        gas: 470000,
        gasPrice: 1
      }).then(() => {
        this.setWaiting(false);
        this.log(`Permission denied`);
        if (callback) callback();
      });
    }
  }

  public setAuthService(fromAddress: string, serviceAddress: string, callback?: () => void): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.log("Setting auth address");
      this.setWaiting(true);
      this.contractInstance.methods.setAuthService(serviceAddress).send({
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
    if (this.contractInstance && this.notInWaitingState()) {
      this.log(`Asking for user status`);
      this.setWaiting(true);
      this.contractInstance.methods.getUserStatus(userAddress).call().then((result) => {
        this.setWaiting(false);
        this.log(`User status received`);
        if (callback) callback();
      });
    }
  }

  public getBalance(callback?: () => {}): any {
    if (this.contractInstance && this.notInWaitingState()) {
      this.log(`Asking for user balance`);
      this.setWaiting(true);
      this.contractInstance.methods.getBalance().call().then((result) => {
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
