import { ToolboxDefinition } from "react-blockly";

const blocks = (...types: string[]) =>
  types.map((type) => ({ kind: "block" as const, type }));

const block = (type: string, inputs: Record<string, unknown>) => ({
  kind: "block" as const,
  type,
  inputs,
});

const shadow = (type: string, fields: Record<string, string> = {}) => ({
  shadow: { type, fields },
});

export const toolbox: ToolboxDefinition = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Source setup",
      colour: "#795548",
      contents: blocks(
        "solidity_preamble",
        "solidity_import",
        "solidity_contract_definition"
      ),
    },
    {
      kind: "category",
      name: "Contract members",
      colour: "#03a9f4",
      contents: blocks(
        "solidity_state_variable",
        "solidity_struct_definition",
        "solidity_enum_definition",
        "solidity_event_definition",
        "solidity_error_definition"
      ),
    },
    {
      kind: "category",
      name: "Functions & modifiers",
      colour: "#9c27b0",
      contents: blocks(
        "solidity_constructor_definition",
        "solidity_function_definition",
        "solidity_modifier_definition",
        "solidity_receive_definition",
        "solidity_fallback_definition"
      ),
    },
    {
      kind: "category",
      name: "Actions",
      colour: "#e91e63",
      contents: [
        block("solidity_assignment_statement", {
          TARGET: shadow("solidity_identifier", { NAME: "value" }),
          VALUE: shadow("math_number", { NUM: "0" }),
        }),
        block("solidity_variable_declaration", {
          INITIAL_VALUE: shadow("math_number", { NUM: "0" }),
        }),
        ...blocks(
          "solidity_emit_statement",
          "solidity_require_statement",
          "solidity_revert_statement",
          "solidity_expression_statement",
          "solidity_return_statement",
          "solidity_delete_statement",
          "controls_if",
          "solidity_while_statement",
          "solidity_for_statement",
          "solidity_loop_control",
          "solidity_unchecked_statement"
        ),
      ],
    },
    {
      kind: "category",
      name: "Values & expressions",
      colour: "#ff9800",
      contents: blocks(
        "solidity_identifier",
        "solidity_environment",
        "solidity_string_literal",
        "solidity_member_access",
        "solidity_index_access",
        "solidity_call_expression",
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
      name: "Advanced / raw Solidity",
      colour: "#795548",
      contents: blocks(
        "solidity_raw_statement",
        "solidity_raw_expression",
        "solidity_raw_member",
        "solidity_raw_top_level",
        "solidity_raw_source",
        "solidity_assembly_statement"
      ),
    },
    {
      kind: "category",
      name: "Classic templates",
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
