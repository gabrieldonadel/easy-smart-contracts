import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { SimpleStorageContact } from "./contract";

const compileWithWorker = async (data: any) => {
  return new Promise<string>((resolve, reject) => {
    const worker = new Worker("./SolcJs.worker.ts", {
      type: "module",
    });
    worker.postMessage(data);
    worker.onmessage = function (event: any) {
      resolve(event.data);
    };
    worker.onerror = reject;
  });
};

// const web3 = new Web3("https://data-seed-prebsc-1-s2.binance.org:8545");
const web3 = new Web3((window as any).ethereum);
web3.eth.setProvider(Web3.givenProvider);

const CompilingSmartContractDemo: React.FC = () => {
  const [compileResult, setCompileResult] = useState<string>("");
  const [compiling, setCompiling] = useState(false);
  const [account, setAccount] = useState(null);

  const getData = async () => {
    const network = await web3.eth.net.getNetworkType();
    await (window as any).ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    console.log("accounts", accounts);

    setAccount(accounts?.[0]);

    console.log("TCL: getData -> network", network);
    console.log("TCL: getData -> accounts", accounts);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleCompile = async () => {
    setCompiling(true);
    const result = await compileWithWorker({
      content: SimpleStorageContact,
    });
    const parsedResult = JSON.parse(result);
    const { SimpleStorage } = (parsedResult as any).contracts["storage.sol"];
    console.log("SimpleStorage", SimpleStorage);

    // 3. Create initial contract instance
    const instance = new web3.eth.Contract(SimpleStorage.abi);
    console.log("instance", instance);

    try {
      // 4. Deploy contract and get new deployed Instance
      const deployedInstance = await instance
        .deploy({ data: SimpleStorage.evm.bytecode.object })
        .send({ from: account, gas: 150000 });

      console.log("deployedInstance", deployedInstance);
      // // Note: deployed address located at `deployedInstance._address`
    } catch (error) {
      console.log("error", error);
    }

    // contractInstance = deployedInstance;
    setCompileResult(result as string);
    setCompiling(false);
  };

  return (
    <div>
      <h2>Compiling Solidity Contract with WebWorker</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3>SmartContract</h3>
          <div>
            <textarea
              defaultValue={SimpleStorageContact}
              style={{
                width: "400px",
                height: "300px",
              }}
            ></textarea>
          </div>
        </div>
        <div
          style={{
            padding: "1em",
          }}
        >
          <button
            className="resource flex"
            onClick={handleCompile}
            disabled={compiling}
          >
            {compiling ? "Compiling" : "Compile"}
          </button>
        </div>
        <div>
          <h3>Compiled Result</h3>
          <div>
            <textarea
              defaultValue={compileResult}
              style={{
                width: "400px",
                height: "300px",
              }}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompilingSmartContractDemo;
