import { ToolboxDefinition } from "react-blockly";

export const toolbox: ToolboxDefinition = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Logic",
      colour: "#5C81A6",
      contents: [
        {
          kind: "block",
          type: "controls_if",
        },
        {
          kind: "block",
          type: "logic_compare",
        },
      ],
    },
    {
      kind: "category",
      name: "Math",
      colour: "#5CA65C",
      contents: [
        {
          kind: "block",
          type: "math_arithmetic",
        },
        {
          kind: "block",
          type: "math_number",
        },
      ],
    },
    {
      kind: "category",
      name: "Custom",
      colour: "#5CA699",
      contents: [
        {
          kind: "block",
          type: "contract",
        },
        {
          kind: "block",
          type: "contract_state",
        },
        {
          kind: "block",
          type: "contract_state_get",
        },
        {
          kind: "block",
          type: "contract_state_set",
        },
        {
          kind: "block",
          type: "contract_method",
        },
        {
          kind: "block",
          type: "contract_method_parameter",
        },
        {
          kind: "block",
          type: "contract_method_parameter_get",
        },
        {
          kind: "block",
          type: "contract_ctor",
        },
        {
          kind: "block",
          type: "contract_method_call",
        },
        {
          kind: "block",
          type: "math_number",
        },
        {
          kind: "block",
          type: "math_arithmetic",
        },
        {
          kind: "block",
          type: "logic_boolean",
        },
        {
          kind: "block",
          type: "logic_compare",
        },
        {
          kind: "block",
          type: "controls_ifelse",
        },
        {
          kind: "block",
          type: "controls_if",
        },
        {
          kind: "block",
          type: "contract_method",
        },
        {
          kind: "block",
          type: "contract_method_parameter",
        },
        {
          kind: "block",
          type: "contract_method_parameter_get",
        },
        {
          kind: "block",
          type: "logic_operation",
        },
      ],
    },
  ],
};
