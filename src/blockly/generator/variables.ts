import Blockly from "blockly";

import { BlocklySolidityGenerator } from "./main";
import { OperationOrder } from "./solidity";

BlocklySolidityGenerator["variables_get"] = function (block) {
  // Variable getter.
  var code = BlocklySolidityGenerator.variableDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.VARIABLE_CATEGORY_NAME
  );
  return [code, OperationOrder.ORDER_ATOMIC];
};

BlocklySolidityGenerator["variables_set"] = function (block) {
  // Variable setter.
  var argument0 =
    BlocklySolidityGenerator.valueToCode(
      block,
      "VALUE",
      OperationOrder.ORDER_ASSIGNMENT
    ) || "0";
  var varName = BlocklySolidityGenerator.variableDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.VARIABLE_CATEGORY_NAME
  );
  return varName + " = " + argument0 + ";\n";
};
