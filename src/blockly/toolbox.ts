import { ToolboxDefinition } from "react-blockly";

const blocks = (...types: string[]) =>
  types.map((type) => ({ kind: "block" as const, type }));

export const toolbox: ToolboxDefinition = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Solidity source",
      colour: "#795548",
      contents: blocks(
        "solidity_preamble",
        "solidity_import",
        "solidity_raw_top_level",
        "solidity_raw_source"
      ),
    },
    {
      kind: "category",
      name: "Contracts & types",
      colour: "#03a9f4",
      contents: blocks(
        "solidity_contract_definition",
        "solidity_state_variable",
        "solidity_struct_definition",
        "solidity_enum_definition",
        "solidity_event_definition",
        "solidity_error_definition",
        "solidity_raw_member"
      ),
    },
    {
      kind: "category",
      name: "Functions",
      colour: "#9c27b0",
      contents: blocks(
        "solidity_constructor_definition",
        "solidity_function_definition",
        "solidity_modifier_definition",
        "solidity_receive_definition",
        "solidity_fallback_definition",
        "contract_method_call",
        "return"
      ),
    },
    {
      kind: "category",
      name: "Statements",
      colour: "#e91e63",
      contents: blocks(
        "solidity_variable_declaration",
        "solidity_unchecked_statement",
        "solidity_assembly_statement",
        "solidity_raw_statement",
        "controls_if"
      ),
    },
    {
      kind: "category",
      name: "Expressions",
      colour: "#ff9800",
      contents: blocks(
        "solidity_raw_expression",
        "logic_compare",
        "logic_boolean",
        "logic_operation",
        "logic_negate",
        "math_arithmetic",
        "math_number",
        "math_modulo"
      ),
    },
    {
      kind: "category",
      name: "Legacy quick contract",
      colour: "#607d8b",
      contents: blocks(
        "contract",
        "contract_state",
        "contract_state_get",
        "contract_state_set",
        "contract_method",
        "contract_method_parameter",
        "contract_method_parameter_get",
        "contract_ctor"
      ),
    },
  ],
};
