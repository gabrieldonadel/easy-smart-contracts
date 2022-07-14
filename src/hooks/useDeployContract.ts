import { useCallback, useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { useSnackbar } from "notistack";

import { web3 } from "../web3";

export const useDeployContract = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState<unknown>();

  const loadAccounts = useCallback(async () => {
    try {
      const accounts = await web3.eth.getAccounts();

      setAccount(accounts?.[0]);

      return accounts;
    } catch (error) {
      console.log("loadAccounts error", error);
    }
  }, []);

  const init = useCallback(async () => {
    const newProvider = await detectEthereumProvider();
    setProvider(newProvider);
    if (newProvider) {
      loadAccounts();
    }
  }, [loadAccounts]);

  useEffect(() => {
    init();
  }, [init]);

  const deploy = async ({ result }) => {
    if (!provider) {
      enqueueSnackbar(
        `Não foi possível se conectar ao MetaMask, por favor certifique-se que a extensão está instalada.
        Mais informações em https://metamask.io/`,
        {
          variant: "error",
        }
      );
      return;
    }
    if (!account) {
      await loadAccounts();
    }

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
      if (error?.message?.includes("User denied transaction signature")) {
        enqueueSnackbar("Assinatura da transação foi negada pelo usuário.", {
          variant: "error",
        });
      }
    }
  };
  return { deploy };
};
