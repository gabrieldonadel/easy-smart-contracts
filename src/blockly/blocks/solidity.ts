import Blockly from "blockly";

const TOP_LEVEL = "solidity_top_level";
const MEMBER = "solidity_contract_member";

const multilineField = (value: string) =>
  new Blockly.FieldMultilineInput(value);

Blockly.Blocks["solidity_preamble"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("SPDX")
      .appendField(new Blockly.FieldTextInput("MIT"), "LICENSE")
      .appendField("pragma solidity")
      .appendField(new Blockly.FieldTextInput("^0.8.20"), "PRAGMA");
    this.setNextStatement(true, TOP_LEVEL);
    this.setColour(20);
    this.setTooltip("Adds the source license and Solidity version pragma.");
  },
};

Blockly.Blocks["solidity_raw_source"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("complete Solidity source")
      .appendField(multilineField("// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n"), "CODE");
    this.setColour(20);
    this.setTooltip("Accepts a complete source unit, including every Solidity and Yul grammar production.");
  },
};

Blockly.Blocks["solidity_import"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("import")
      .appendField(new Blockly.FieldTextInput('"./Contract.sol"'), "IMPORT");
    this.setPreviousStatement(true, TOP_LEVEL);
    this.setNextStatement(true, TOP_LEVEL);
    this.setColour(20);
  },
};

Blockly.Blocks["solidity_raw_top_level"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("top-level Solidity")
      .appendField(multilineField("type Price is uint256;"), "CODE");
    this.setPreviousStatement(true, TOP_LEVEL);
    this.setNextStatement(true, TOP_LEVEL);
    this.setColour(20);
    this.setTooltip("Top-level escape hatch for imports, types, constants, free functions, using directives, and future syntax.");
  },
};

Blockly.Blocks["solidity_contract_definition"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ["contract", "contract"],
        ["abstract contract", "abstract contract"],
        ["interface", "interface"],
        ["library", "library"],
      ]), "KIND")
      .appendField(new Blockly.FieldTextInput("MyContract"), "NAME")
      .appendField("inherits")
      .appendField(new Blockly.FieldTextInput(""), "INHERITS");
    this.appendStatementInput("BODY").setCheck(MEMBER).appendField("body");
    this.setPreviousStatement(true, TOP_LEVEL);
    this.setNextStatement(true, TOP_LEVEL);
    this.setColour(160);
  },
};

const defineMemberBlock = (type: string, label: string, example: string) => {
  Blockly.Blocks[type] = {
    init: function () {
      this.appendDummyInput()
        .appendField(label)
        .appendField(multilineField(example), "CODE");
      this.setPreviousStatement(true, MEMBER);
      this.setNextStatement(true, MEMBER);
      this.setColour(180);
    },
  };
};

defineMemberBlock(
  "solidity_raw_member",
  "contract member Solidity",
  "using SafeMath for uint256;"
);

Blockly.Blocks["solidity_state_variable"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("state")
      .appendField(new Blockly.FieldTextInput("uint256"), "TYPE")
      .appendField(new Blockly.FieldDropdown([
        ["default", ""], ["public", "public"], ["internal", "internal"], ["private", "private"],
      ]), "VISIBILITY")
      .appendField(new Blockly.FieldDropdown([
        ["mutable", ""], ["constant", "constant"], ["immutable", "immutable"], ["transient", "transient"],
      ]), "MUTABILITY")
      .appendField(new Blockly.FieldTextInput("value"), "NAME");
    this.appendDummyInput()
      .appendField("initializer")
      .appendField(new Blockly.FieldTextInput(""), "INITIALIZER");
    this.setPreviousStatement(true, MEMBER);
    this.setNextStatement(true, MEMBER);
    this.setColour(195);
  },
};

Blockly.Blocks["solidity_event_definition"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("event")
      .appendField(new Blockly.FieldTextInput("Changed"), "NAME")
      .appendField("parameters")
      .appendField(new Blockly.FieldTextInput("address indexed account"), "PARAMS")
      .appendField("anonymous")
      .appendField(
        new Blockly.FieldCheckbox("FALSE", undefined, undefined),
        "ANONYMOUS"
      );
    this.setPreviousStatement(true, [TOP_LEVEL, MEMBER]);
    this.setNextStatement(true, [TOP_LEVEL, MEMBER]);
    this.setColour(230);
  },
};

Blockly.Blocks["solidity_error_definition"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("error")
      .appendField(new Blockly.FieldTextInput("Unauthorized"), "NAME")
      .appendField("parameters")
      .appendField(new Blockly.FieldTextInput("address caller"), "PARAMS");
    this.setPreviousStatement(true, [TOP_LEVEL, MEMBER]);
    this.setNextStatement(true, [TOP_LEVEL, MEMBER]);
    this.setColour(230);
  },
};

Blockly.Blocks["solidity_struct_definition"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("struct")
      .appendField(new Blockly.FieldTextInput("Item"), "NAME")
      .appendField(multilineField("uint256 id;\naddress owner;"), "MEMBERS");
    this.setPreviousStatement(true, [TOP_LEVEL, MEMBER]);
    this.setNextStatement(true, [TOP_LEVEL, MEMBER]);
    this.setColour(230);
  },
};

Blockly.Blocks["solidity_enum_definition"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("enum")
      .appendField(new Blockly.FieldTextInput("Status"), "NAME")
      .appendField("members")
      .appendField(new Blockly.FieldTextInput("Open, Closed"), "MEMBERS");
    this.setPreviousStatement(true, [TOP_LEVEL, MEMBER]);
    this.setNextStatement(true, [TOP_LEVEL, MEMBER]);
    this.setColour(230);
  },
};

Blockly.Blocks["solidity_modifier_definition"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("modifier")
      .appendField(new Blockly.FieldTextInput("onlyOwner"), "NAME")
      .appendField("parameters")
      .appendField(new Blockly.FieldTextInput(""), "PARAMS")
      .appendField("attributes")
      .appendField(new Blockly.FieldTextInput(""), "ATTRIBUTES");
    this.appendStatementInput("BODY").appendField("body");
    this.setPreviousStatement(true, MEMBER);
    this.setNextStatement(true, MEMBER);
    this.setColour(290);
  },
};

Blockly.Blocks["solidity_constructor_definition"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("constructor parameters")
      .appendField(new Blockly.FieldTextInput(""), "PARAMS")
      .appendField("modifiers/base constructors")
      .appendField(new Blockly.FieldTextInput(""), "MODIFIERS");
    this.appendStatementInput("BODY").appendField("body");
    this.setPreviousStatement(true, MEMBER);
    this.setNextStatement(true, MEMBER);
    this.setColour(290);
  },
};

Blockly.Blocks["solidity_function_definition"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("function")
      .appendField(new Blockly.FieldTextInput("myFunction"), "NAME")
      .appendField("parameters")
      .appendField(new Blockly.FieldTextInput(""), "PARAMS");
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ["public", "public"], ["external", "external"], ["internal", "internal"], ["private", "private"], ["default", ""],
      ]), "VISIBILITY")
      .appendField(new Blockly.FieldDropdown([
        ["nonpayable", ""], ["view", "view"], ["pure", "pure"], ["payable", "payable"],
      ]), "MUTABILITY")
      .appendField("modifiers / virtual / override")
      .appendField(new Blockly.FieldTextInput(""), "MODIFIERS");
    this.appendDummyInput()
      .appendField("returns")
      .appendField(new Blockly.FieldTextInput(""), "RETURNS")
      .appendField("declaration only")
      .appendField(
        new Blockly.FieldCheckbox("FALSE", undefined, undefined),
        "DECLARATION"
      );
    this.appendStatementInput("BODY").appendField("body");
    this.setPreviousStatement(true, [TOP_LEVEL, MEMBER]);
    this.setNextStatement(true, [TOP_LEVEL, MEMBER]);
    this.setColour(290);
  },
};

Blockly.Blocks["solidity_receive_definition"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("receive")
      .appendField(new Blockly.FieldDropdown([["external", "external"]]), "VISIBILITY")
      .appendField(new Blockly.FieldDropdown([["payable", "payable"]]), "MUTABILITY");
    this.appendStatementInput("BODY").appendField("body");
    this.setPreviousStatement(true, MEMBER);
    this.setNextStatement(true, MEMBER);
    this.setColour(290);
  },
};

Blockly.Blocks["solidity_fallback_definition"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("fallback parameters")
      .appendField(new Blockly.FieldTextInput(""), "PARAMS")
      .appendField(new Blockly.FieldDropdown([["external", "external"]]), "VISIBILITY")
      .appendField(new Blockly.FieldDropdown([["nonpayable", ""], ["payable", "payable"]]), "MUTABILITY");
    this.appendDummyInput()
      .appendField("returns")
      .appendField(new Blockly.FieldTextInput(""), "RETURNS");
    this.appendStatementInput("BODY").appendField("body");
    this.setPreviousStatement(true, MEMBER);
    this.setNextStatement(true, MEMBER);
    this.setColour(290);
  },
};

Blockly.Blocks["solidity_raw_statement"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Solidity statement(s)")
      .appendField(multilineField("require(condition);"), "CODE");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setTooltip("Statement escape hatch for try/catch, assembly, tuple declarations, emit, revert, loops, and future syntax.");
  },
};

Blockly.Blocks["solidity_variable_declaration"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("local")
      .appendField(new Blockly.FieldTextInput("uint256"), "TYPE")
      .appendField(new Blockly.FieldTextInput("value"), "NAME")
      .appendField("=")
      .appendField(new Blockly.FieldTextInput("0"), "VALUE");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
  },
};

Blockly.Blocks["solidity_unchecked_statement"] = {
  init: function () {
    this.appendStatementInput("BODY").appendField("unchecked");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
  },
};

Blockly.Blocks["solidity_assembly_statement"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("assembly flags")
      .appendField(new Blockly.FieldTextInput('"memory-safe"'), "FLAGS")
      .appendField(multilineField("let size := msize()"), "CODE");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
  },
};

Blockly.Blocks["solidity_raw_expression"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Solidity expression")
      .appendField(new Blockly.FieldTextInput("msg.sender"), "CODE");
    this.setOutput(true);
    this.setColour(60);
    this.setTooltip("Expression escape hatch for calls, conversions, member/index access, tuples, arrays, new, and operators.");
  },
};

export { MEMBER, TOP_LEVEL };
