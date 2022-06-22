import { BlocklySolidityGenerator, getVariableName } from "./main";
import { OperationOrder } from "./solidity";

BlocklySolidityGenerator["contract_method"] = function (block) {
  var params = BlocklySolidityGenerator.statementToCode(block, "PARAMS").trim();
  var branch = BlocklySolidityGenerator.statementToCode(block, "STACK");
  var code =
    "function " +
    block.getFieldValue("NAME") +
    "(" +
    params +
    ") public {\n" + // add types
    branch +
    "}\n";

  return code;
};

BlocklySolidityGenerator["contract_ctor"] = function (block) {
  var parent = block.getSurroundParent();

  if (!parent) {
    return "";
  }

  var params = BlocklySolidityGenerator.statementToCode(block, "PARAMS").trim();
  var branch = BlocklySolidityGenerator.statementToCode(block, "STACK");
  var code =
    "function " +
    parent.getFieldValue("NAME") +
    "(" +
    params +
    ") {\n" +
    branch +
    "}\n";

  return code;
};

BlocklySolidityGenerator["contract_method_parameter"] = function (block) {
  var name = block.getFieldValue("NAME");
  var nextBlock = block.getNextBlock();
  var sep = nextBlock && nextBlock.type === block.type ? ", " : "";
  var types = {
    TYPE_BOOL: "bool",
    TYPE_INT: "int",
    TYPE_UINT: "uint",
  };

  return types[block.getFieldValue("TYPE")] + " " + name + sep;
};

BlocklySolidityGenerator["contract_method_parameter_get"] = function (block) {
  var variableId = block.getFieldValue("PARAM_NAME");
  var variable = block.workspace.getVariableById(variableId);

  if (!variable) {
    return "";
  }

  return [getVariableName(variable), OperationOrder.ORDER_ATOMIC];
};

BlocklySolidityGenerator["contract_intrinsic_sha3"] = function (block) {
  var argument0 =
    BlocklySolidityGenerator.valueToCode(
      block,
      "VALUE",
      OperationOrder.ORDER_ASSIGNMENT
    ) || "0";

  return ["sha3(" + argument0 + ")", OperationOrder.ORDER_ATOMIC];
};

BlocklySolidityGenerator["contract_method_call"] = function (block) {
  var variableId = block.getFieldValue("METHOD_NAME");
  var variable = block.workspace.getVariableById(variableId);

  if (!variable) {
    return "";
  }

  return "this." + getVariableName(variable) + "();\n";
};
