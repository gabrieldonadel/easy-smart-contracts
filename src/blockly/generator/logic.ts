import { BlocklySolidityGenerator } from "./main";
import { OperationOrder } from "./solidity";

BlocklySolidityGenerator["controls_if"] = function (block) {
  // If/elseif/else condition.
  var n = 0;
  var code = "",
    branchCode,
    conditionCode;
  do {
    conditionCode =
      BlocklySolidityGenerator.valueToCode(
        block,
        "IF" + n,
        OperationOrder.ORDER_NONE
      ) || "false";
    branchCode = BlocklySolidityGenerator.statementToCode(block, "DO" + n);
    code +=
      (n > 0 ? " else " : "") +
      "if (" +
      conditionCode +
      ") {\n" +
      branchCode +
      "}";

    ++n;
  } while (block.getInput("IF" + n));

  if (block.getInput("ELSE")) {
    branchCode = BlocklySolidityGenerator.statementToCode(block, "ELSE");
    code += " else {\n" + branchCode + "}";
  }
  return code + "\n";
};

BlocklySolidityGenerator["controls_ifelse"] =
  BlocklySolidityGenerator["controls_if"];

BlocklySolidityGenerator["logic_compare"] = function (block) {
  // Comparison operator.
  var OPERATORS = {
    EQ: "==",
    NEQ: "!=",
    LT: "<",
    LTE: "<=",
    GT: ">",
    GTE: ">=",
  };
  var operator = OPERATORS[block.getFieldValue("OP")];
  var order =
    operator === "==" || operator === "!="
      ? OperationOrder.ORDER_EQUALITY
      : OperationOrder.ORDER_RELATIONAL;
  var argument0 =
    BlocklySolidityGenerator.valueToCode(block, "A", order) || "0";
  var argument1 =
    BlocklySolidityGenerator.valueToCode(block, "B", order) || "0";
  var code = argument0 + " " + operator + " " + argument1;
  return [code, order];
};

BlocklySolidityGenerator["logic_operation"] = function (block) {
  // Operations 'and', 'or'.
  var operator = block.getFieldValue("OP") === "AND" ? "&&" : "||";
  var order =
    operator === "&&"
      ? OperationOrder.ORDER_LOGICAL_AND
      : OperationOrder.ORDER_LOGICAL_OR;
  var argument0 = BlocklySolidityGenerator.valueToCode(block, "A", order);
  var argument1 = BlocklySolidityGenerator.valueToCode(block, "B", order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = "false";
    argument1 = "false";
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = operator === "&&" ? "true" : "false";
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + " " + operator + " " + argument1;
  return [code, order];
};

BlocklySolidityGenerator["logic_negate"] = function (block) {
  // Negation.
  var order = OperationOrder.ORDER_LOGICAL_NOT;
  var argument0 =
    BlocklySolidityGenerator.valueToCode(block, "BOOL", order) || "true";
  var code = "!" + argument0;
  return [code, order];
};

BlocklySolidityGenerator["logic_boolean"] = function (block) {
  // Boolean values true and false.
  var code = block.getFieldValue("BOOL") === "TRUE" ? "true" : "false";
  return [code, OperationOrder.ORDER_ATOMIC];
};

BlocklySolidityGenerator["logic_null"] = function (block) {
  // Null data type.
  return ["null", OperationOrder.ORDER_ATOMIC];
};

BlocklySolidityGenerator["logic_ternary"] = function (block) {
  // Ternary operator.
  var value_if =
    BlocklySolidityGenerator.valueToCode(
      block,
      "IF",
      OperationOrder.ORDER_CONDITIONAL
    ) || "false";
  var value_then =
    BlocklySolidityGenerator.valueToCode(
      block,
      "THEN",
      OperationOrder.ORDER_CONDITIONAL
    ) || "null";
  var value_else =
    BlocklySolidityGenerator.valueToCode(
      block,
      "ELSE",
      OperationOrder.ORDER_CONDITIONAL
    ) || "null";
  var code = value_if + " ? " + value_then + " : " + value_else;
  return [code, OperationOrder.ORDER_CONDITIONAL];
};
