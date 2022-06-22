import { useCallback, useEffect, useState } from "react";

import { web3 } from "../web3";

export const useDeployContract = () => {
  const [account, setAccount] = useState(null);

  const loadAccounts = useCallback(async () => {
    await (window as any).ethereum.enable();
    const accounts = await web3.eth.getAccounts();

    setAccount(accounts?.[0]);
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const deploy = async ({ result }) => {
    const parsedResult = JSON.parse(result);
    const contract = (parsedResult as any).contracts["contract.sol"];
    const contractInstance: any = Object.values(contract)?.[0];

    const instance = new web3.eth.Contract(contractInstance.abi);

    try {
      const deployedInstance = await instance
        .deploy({ data: contractInstance.evm.bytecode.object })
        .send({ from: account });

      console.log("deployedInstance", deployedInstance);
    } catch (error) {
      console.log("error", error);
    }
  };
  return { deploy };
};
