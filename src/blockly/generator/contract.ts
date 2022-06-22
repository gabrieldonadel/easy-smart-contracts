import { BlocklySolidityGenerator, getVariableName } from "./main";
import { OperationOrder } from "./solidity";

BlocklySolidityGenerator["contract"] = function (block) {
  var states = BlocklySolidityGenerator.statementToCode(block, "STATES");
  var ctor = BlocklySolidityGenerator.statementToCode(block, "CTOR");
  var methods = BlocklySolidityGenerator.statementToCode(block, "METHODS");
  var code =
    "// SPDX-License-Identifier: MIT\n" + // Add different licenses support
    "pragma solidity ^0.8.6;\n\n" +
    "contract " +
    block.getFieldValue("NAME") +
    " {\n" +
    states +
    // "  function () { throw; }\n" +
    ctor +
    methods +
    "}\n";

  return code;
};

BlocklySolidityGenerator["contract_state"] = function (block) {
  var name = block.getFieldValue("NAME");
  var value = BlocklySolidityGenerator.valueToCode(
    block,
    "VALUE",
    OperationOrder.ORDER_ASSIGNMENT
  );
  var type = block.getFieldValue("TYPE");
  var types = {
    TYPE_BOOL: "bool",
    TYPE_INT: "int",
    TYPE_UINT: "uint",
  };
  var defaultValue = {
    TYPE_BOOL: "false",
    TYPE_INT: "0",
    TYPE_UINT: "0",
  };

  if (value === "") {
    value = defaultValue[type];
  }

  return types[type] + " " + name + " = " + value + ";\n";
};

BlocklySolidityGenerator["contract_state_get"] = function (block) {
  var variableId = block.getFieldValue("STATE_NAME");
  var variable = block.workspace.getVariableById(variableId);

  if (!variable) {
    return "";
  }

  return ["this." + getVariableName(variable), OperationOrder.ORDER_ATOMIC];
};

BlocklySolidityGenerator["contract_state_set"] = function (block) {
  // Variable setter.
  var argument0 =
    BlocklySolidityGenerator.valueToCode(
      block,
      "STATE_VALUE",
      OperationOrder.ORDER_ASSIGNMENT
    ) || "0";
  var variableId = block.getFieldValue("STATE_NAME");
  var variable = block.workspace.getVariableById(variableId);

  if (!variable) {
    return "";
  }

  // return "this." + getVariableName(variable) + " = " + argument0 + ";\n";
  return getVariableName(variable) + " = " + argument0 + ";\n";
};
