import { useCallback, useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { useSnackbar } from "notistack";

import { web3 } from "../web3";

export const useDeployContract = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState<any>();

  const loadAccounts = useCallback(async () => {
    try {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts?.[0]);
      return accounts?.[0];
    } catch (error) {
      console.log("loadAccounts error", error);
      if (error?.message?.includes("Already processing eth_requestAccounts.")) {
        enqueueSnackbar("Certifique-se que sua carteira esteja desbloqueada", {
          variant: "warning",
        });
      }
    }
  }, [enqueueSnackbar, provider]);

  useEffect(() => {
    detectEthereumProvider().then((newProvider) => {
      setProvider(newProvider);
    });
  }, []);

  useEffect(() => {
    if (provider) {
      loadAccounts();
    }
  }, [loadAccounts, provider]);

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
