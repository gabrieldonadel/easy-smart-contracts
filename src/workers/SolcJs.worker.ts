/* eslint-disable no-restricted-globals */
import * as wrapper from "solc/wrapper";
// eslint-disable-next-line import/no-webpack-loader-syntax
import soljsonUrl from "file-loader!solc/soljson.js";
const ctx: Worker = self as any;

importScripts(soljsonUrl);
const solc = wrapper((ctx as any).Module);

ctx.addEventListener("message", ({ data }) => {
  try {
    const compileResult = solc.compile(
      createCompileInput(data.contractFileName, data.content)
    );
    ctx.postMessage({ type: "result", result: compileResult });
  } catch (error) {
    ctx.postMessage({ type: "error", error: String(error) });
  }
});

function createCompileInput(
  fileName = "contract.sol",
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
