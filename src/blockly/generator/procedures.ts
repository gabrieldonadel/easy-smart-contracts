import { Block } from "blockly";

import { BlocklySolidityGenerator } from "./main";
import { OperationOrder } from "./solidity";

BlocklySolidityGenerator["return"] = function (block: Block) {
  const argument = BlocklySolidityGenerator.valueToCode(
    block,
    "STATE_NAME",
    OperationOrder.ORDER_ASSIGNMENT
  );

  return "return " + argument + ";\n";
};
