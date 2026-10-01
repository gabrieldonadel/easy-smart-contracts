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
  const initializer = field(block, "INITIALIZER");
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
  const value = field(block, "VALUE");
  return `${tokens(field(block, "TYPE"), field(block, "NAME"))}${
    value ? ` = ${value}` : ""
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
