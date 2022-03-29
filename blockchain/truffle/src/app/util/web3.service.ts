import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
declare let require: any;
const Web3 = require('web3');
const contract = require('@truffle/contract');
declare let window: any;

@Injectable()
export class Web3Service {
  public web3: any;
  public accounts: string[];
  public ready = false;

  public accountsObservable = new Subject<string[]>();

  constructor() {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.enable().then(() => {
        this.web3 = new Web3(window.ethereum);
      });
    } else {
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8543'));
    }
    setInterval(() => this.refreshAccounts(), 1000);
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }
    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;
  }

  public async initializeContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.initializeContract(artifacts);
    }
    const id = await this.web3.eth.net.getId();
    return new this.web3.eth.Contract(artifacts.abi,artifacts.networks[id].address);
  }

  private async refreshAccounts() {
    const accs = await this.web3.eth.getAccounts();
    console.log('Refreshing accounts');

    if (accs.length === 0) {
      console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
      return;
    }

    if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
      console.log('Observed new accounts');

      this.accountsObservable.next(accs);
      this.accounts = accs;
    }

    this.ready = true;
  }

  getWeb3Instance(){
    return this.web3;
  }
}
