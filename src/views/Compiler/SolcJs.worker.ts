/* eslint-disable no-restricted-globals */
import * as wrapper from "solc/wrapper";
const ctx: Worker = self as any;

importScripts(
  "https://solc-bin.ethereum.org/bin/soljson-v0.8.6+commit.11564f7e.js"
);

ctx.addEventListener("message", ({ data }) => {
  const solc = wrapper((ctx as any).Module);
  const compileResult = solc.compile(
    createCompileInput(data.contractFileName, data.content)
  );
  ctx.postMessage(compileResult);
});

function createCompileInput(
  fileName = "storage.sol",
  fileContent: string
): string {
  const CompileInput = {
    language: "Solidity",
    sources: {
      [fileName]: {
        content: fileContent,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };
  return JSON.stringify(CompileInput);
}
