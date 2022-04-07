import {Injectable} from "@angular/core";
import {Web3Service} from "./web3.service";

@Injectable()
export class AccountsService {
  accounts: string[];

  constructor(private web3Service: Web3Service) {

  }

  subscribeToAccounts(){
    this.web3Service.accountsObservable.subscribe(accounts => this.accounts = accounts)
  }

  getAccounts(){
    return this.accounts
  }

  getAccountsObservable(){
    return this.web3Service.accountsObservable;
  }
}
