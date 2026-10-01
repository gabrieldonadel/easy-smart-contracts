import { BlocklySolidityGenerator } from "./main";

const field = (block, name: string) =>
  String(block.getFieldValue(name) || "").trim();

const lines = (value: string) => value.replace(/\r\n/g, "\n").trim();

const line = (value: string) => {
  const normalized = lines(value);
  return normalized ? normalized + "\n" : "";
};

const tokens = (...values: string[]) => values.filter(Boolean).join(" ");

const body = (block, input = "BODY") =>
  BlocklySolidityGenerator.statementToCode(block, input);

const value = (block, input: string, fallback = "", order = 99) =>
  BlocklySolidityGenerator.valueToCode(block, input, order) || fallback;

const braced = (header: string, contents: string) =>
  `${header} {\n${contents}}\n`;

BlocklySolidityGenerator["solidity_preamble"] = function (block) {
  return `// SPDX-License-Identifier: ${field(block, "LICENSE") || "UNLICENSED"}\npragma solidity ${field(block, "PRAGMA") || "^0.8.20"};\n\n`;
};

BlocklySolidityGenerator["solidity_raw_source"] = function (block) {
  return line(field(block, "CODE"));
};

BlocklySolidityGenerator["solidity_import"] = function (block) {
  const importValue = field(block, "IMPORT");
  return `import ${importValue.replace(/;$/, "")};\n`;
};

BlocklySolidityGenerator["solidity_raw_top_level"] = function (block) {
  return line(field(block, "CODE"));
};

BlocklySolidityGenerator["solidity_contract_definition"] = function (block) {
  const inheritance = field(block, "INHERITS");
  const header = tokens(
    field(block, "KIND") || "contract",
    field(block, "NAME") || "MyContract",
    inheritance ? `is ${inheritance}` : ""
  );
  return braced(header, body(block));
};

BlocklySolidityGenerator["solidity_raw_member"] = function (block) {
  return line(field(block, "CODE"));
};

BlocklySolidityGenerator["solidity_state_variable"] = function (block) {
  const declaration = tokens(
    field(block, "TYPE") || "uint256",
    field(block, "VISIBILITY"),
    field(block, "MUTABILITY"),
    field(block, "NAME") || "value"
  );
  const initializer =
    value(block, "INITIAL_VALUE") || field(block, "INITIALIZER");
  return `${declaration}${initializer ? ` = ${initializer}` : ""};\n`;
};

BlocklySolidityGenerator["solidity_event_definition"] = function (block) {
  const anonymous = field(block, "ANONYMOUS") === "TRUE" ? " anonymous" : "";
  return `event ${field(block, "NAME")}(${field(block, "PARAMS")})${anonymous};\n`;
};

BlocklySolidityGenerator["solidity_error_definition"] = function (block) {
  return `error ${field(block, "NAME")}(${field(block, "PARAMS")});\n`;
};

BlocklySolidityGenerator["solidity_struct_definition"] = function (block) {
  const members = lines(field(block, "MEMBERS"))
    .split("\n")
    .filter(Boolean)
    .map((member) => `  ${member.trim()}`)
    .join("\n");
  return `struct ${field(block, "NAME")} {\n${members}\n}\n`;
};

BlocklySolidityGenerator["solidity_enum_definition"] = function (block) {
  return `enum ${field(block, "NAME")} { ${field(block, "MEMBERS")} }\n`;
};

BlocklySolidityGenerator["solidity_modifier_definition"] = function (block) {
  const header = tokens(
    `modifier ${field(block, "NAME")}(${field(block, "PARAMS")})`,
    field(block, "ATTRIBUTES")
  );
  return braced(header, body(block));
};

BlocklySolidityGenerator["solidity_constructor_definition"] = function (block) {
  return braced(
    tokens(
      `constructor(${field(block, "PARAMS")})`,
      field(block, "MODIFIERS")
    ),
    body(block)
  );
};

BlocklySolidityGenerator["solidity_function_definition"] = function (block) {
  const returns = field(block, "RETURNS");
  const header = tokens(
    `function ${field(block, "NAME")}(${field(block, "PARAMS")})`,
    field(block, "VISIBILITY"),
    field(block, "MUTABILITY"),
    field(block, "MODIFIERS"),
    returns ? `returns (${returns})` : ""
  );
  return field(block, "DECLARATION") === "TRUE"
    ? `${header};\n`
    : braced(header, body(block));
};

BlocklySolidityGenerator["solidity_receive_definition"] = function (block) {
  return braced(
    tokens("receive()", field(block, "VISIBILITY"), field(block, "MUTABILITY")),
    body(block)
  );
};

BlocklySolidityGenerator["solidity_fallback_definition"] = function (block) {
  const returns = field(block, "RETURNS");
  return braced(
    tokens(
      `fallback(${field(block, "PARAMS")})`,
      field(block, "VISIBILITY"),
      field(block, "MUTABILITY"),
      returns ? `returns (${returns})` : ""
    ),
    body(block)
  );
};

BlocklySolidityGenerator["solidity_raw_statement"] = function (block) {
  return line(field(block, "CODE"));
};

BlocklySolidityGenerator["solidity_variable_declaration"] = function (block) {
  const initialValue = value(block, "INITIAL_VALUE") || field(block, "VALUE");
  return `${tokens(field(block, "TYPE"), field(block, "NAME"))}${
    initialValue ? ` = ${initialValue}` : ""
  };\n`;
};

BlocklySolidityGenerator["solidity_unchecked_statement"] = function (block) {
  return braced("unchecked", body(block));
};

BlocklySolidityGenerator["solidity_assembly_statement"] = function (block) {
  const flags = field(block, "FLAGS");
  const contents = lines(field(block, "CODE"))
    .split("\n")
    .map((entry) => `  ${entry}`)
    .join("\n");
  return `assembly${flags ? ` (${flags})` : ""} {\n${contents}\n}\n`;
};

BlocklySolidityGenerator["solidity_raw_expression"] = function (block) {
  return [field(block, "CODE") || "0", 0];
};

BlocklySolidityGenerator["solidity_identifier"] = function (block) {
  return [field(block, "NAME") || "value", 0];
};

BlocklySolidityGenerator["solidity_environment"] = function (block) {
  return [field(block, "VALUE") || "msg.sender", 0];
};

BlocklySolidityGenerator["solidity_string_literal"] = function (block) {
  return [JSON.stringify(field(block, "VALUE")), 0];
};

BlocklySolidityGenerator["solidity_member_access"] = function (block) {
  const object = value(block, "OBJECT", "value", 1.2);
  return [`${object}.${field(block, "MEMBER") || "length"}`, 1.2];
};

BlocklySolidityGenerator["solidity_index_access"] = function (block) {
  const target = value(block, "TARGET", "values", 1.2);
  return [`${target}[${value(block, "INDEX", "0")}]`, 1.2];
};

BlocklySolidityGenerator["solidity_call_expression"] = function (block) {
  const callee = value(block, "CALLEE", "functionName", 2);
  return [`${callee}(${field(block, "ARGS")})`, 2];
};

BlocklySolidityGenerator["solidity_assignment_statement"] = function (block) {
  const operator = field(block, "OPERATOR") || "=";
  return `${value(block, "TARGET", "value")} ${operator} ${value(
    block,
    "VALUE",
    "0"
  )};\n`;
};

BlocklySolidityGenerator["solidity_emit_statement"] = function (block) {
  return `emit ${field(block, "NAME") || "Changed"}(${field(block, "ARGS")});\n`;
};

BlocklySolidityGenerator["solidity_require_statement"] = function (block) {
  const condition = value(block, "CONDITION", "true");
  const message = value(block, "MESSAGE");
  return `${field(block, "KIND") || "require"}(${condition}${
    message ? `, ${message}` : ""
  });\n`;
};

BlocklySolidityGenerator["solidity_expression_statement"] = function (block) {
  return `${value(block, "EXPRESSION", "functionName()")};\n`;
};

BlocklySolidityGenerator["solidity_revert_statement"] = function (block) {
  const error = field(block, "ERROR");
  return error
    ? `revert ${error}(${field(block, "ARGS")});\n`
    : "revert();\n";
};

BlocklySolidityGenerator["solidity_return_statement"] = function (block) {
  const returnValue = value(block, "VALUE");
  return `return${returnValue ? ` ${returnValue}` : ""};\n`;
};

BlocklySolidityGenerator["solidity_delete_statement"] = function (block) {
  return `delete ${value(block, "TARGET", "value")};\n`;
};

BlocklySolidityGenerator["solidity_while_statement"] = function (block) {
  return braced(
    `while (${value(block, "CONDITION", "true")})`,
    body(block)
  );
};

BlocklySolidityGenerator["solidity_for_statement"] = function (block) {
  const header = `for (${field(block, "INITIALIZER")}; ${field(
    block,
    "CONDITION"
  )}; ${field(block, "LOOP")})`;
  return braced(header, body(block));
};

BlocklySolidityGenerator["solidity_loop_control"] = function (block) {
  return `${field(block, "CONTROL") || "break"};\n`;
};
