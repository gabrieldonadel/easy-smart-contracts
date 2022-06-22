import Web3 from "web3";

export const web3 = new Web3((window as any).ethereum);
web3.eth.setProvider(Web3.givenProvider);
