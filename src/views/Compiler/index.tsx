import React, { useState } from "react";

import StorageContract from "../../contracts/Storage.sol";
import { useDeployContract } from "../../hooks/useDeployContract";
import { compileWithWorker } from "../../workers/utils";

const CompilingSmartContractDemo: React.FC = () => {
  const [compileResult, setCompileResult] = useState<string>("");
  const [compiling, setCompiling] = useState(false);
  const { deploy } = useDeployContract();

  const handleCompile = async () => {
    setCompiling(true);
    const result = await compileWithWorker({
      content: StorageContract,
    });
    await deploy({ result });

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
              defaultValue={StorageContract}
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
