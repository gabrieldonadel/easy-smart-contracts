import Blockly from "blockly";
import solc from "solc";

import { BlocklySolidityGenerator } from "./solidity";

const createBlock = (
  workspace: Blockly.Workspace,
  type: string,
  fields: Record<string, string> = {}
) => {
  const block = workspace.newBlock(type);
  Object.entries(fields).forEach(([name, value]) =>
    block.setFieldValue(value, name)
  );
  return block;
};

const connectNext = (left: Blockly.Block, right: Blockly.Block) => {
  left.nextConnection.connect(right.previousConnection);
};

const connectStatement = (
  parent: Blockly.Block,
  input: string,
  child: Blockly.Block
) => {
  parent.getInput(input).connection.connect(child.previousConnection);
};

const connectValue = (
  parent: Blockly.Block,
  input: string,
  child: Blockly.Block
) => {
  parent.getInput(input).connection.connect(child.outputConnection);
};

const balanceUpdate = (workspace: Blockly.Workspace) => {
  const assignment = createBlock(workspace, "solidity_assignment_statement", {
    OPERATOR: "+=",
  });
  const indexedBalance = createBlock(workspace, "solidity_index_access");
  connectValue(indexedBalance, "TARGET", createBlock(workspace, "solidity_identifier", { NAME: "balances" }));
  connectValue(indexedBalance, "INDEX", createBlock(workspace, "solidity_environment", { VALUE: "msg.sender" }));
  connectValue(assignment, "TARGET", indexedBalance);
  connectValue(assignment, "VALUE", createBlock(workspace, "solidity_environment", { VALUE: "msg.value" }));
  return assignment;
};

const compile = (source: string) => {
  const result = JSON.parse(
    solc.compile(
      JSON.stringify({
        language: "Solidity",
        sources: { "Contract.sol": { content: source } },
        settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
      })
    )
  );

  return (result.errors || []).filter((error) => error.severity === "error");
};

describe("modern Solidity blocks", () => {
  it("generates a compilable contract with modern declarations and functions", () => {
    const workspace = new Blockly.Workspace();
    const preamble = createBlock(workspace, "solidity_preamble", {
      LICENSE: "MIT",
      PRAGMA: "^0.8.20",
    });
    const contract = createBlock(workspace, "solidity_contract_definition", {
      KIND: "contract",
      NAME: "Vault",
      INHERITS: "",
    });
    connectNext(preamble, contract);

    const event = createBlock(workspace, "solidity_event_definition", {
      NAME: "Deposited",
      PARAMS: "address indexed account, uint256 amount",
      ANONYMOUS: "FALSE",
    });
    const error = createBlock(workspace, "solidity_error_definition", {
      NAME: "Unauthorized",
      PARAMS: "address caller",
    });
    const struct = createBlock(workspace, "solidity_struct_definition", {
      NAME: "Deposit",
      MEMBERS: "address account;\nuint256 amount;",
    });
    const enumBlock = createBlock(workspace, "solidity_enum_definition", {
      NAME: "Status",
      MEMBERS: "Open, Closed",
    });
    const owner = createBlock(workspace, "solidity_state_variable", {
      TYPE: "address",
      VISIBILITY: "public",
      MUTABILITY: "immutable",
      NAME: "owner",
    });
    const balances = createBlock(workspace, "solidity_state_variable", {
      TYPE: "mapping(address => uint256)",
      VISIBILITY: "public",
      MUTABILITY: "",
      NAME: "balances",
    });
    const modifier = createBlock(workspace, "solidity_modifier_definition", {
      NAME: "onlyOwner",
      PARAMS: "",
      ATTRIBUTES: "",
    });
    const modifierBody = createBlock(workspace, "solidity_raw_statement", {
      CODE: 'if (msg.sender != owner) revert Unauthorized(msg.sender);\n_;',
    });
    connectStatement(modifier, "BODY", modifierBody);

    const constructor = createBlock(workspace, "solidity_constructor_definition", {
      PARAMS: "address initialOwner",
      MODIFIERS: "",
    });
    const constructorBody = createBlock(workspace, "solidity_assignment_statement", {
      OPERATOR: "=",
    });
    connectValue(constructorBody, "TARGET", createBlock(workspace, "solidity_identifier", { NAME: "owner" }));
    connectValue(constructorBody, "VALUE", createBlock(workspace, "solidity_identifier", { NAME: "initialOwner" }));
    connectStatement(constructor, "BODY", constructorBody);

    const deposit = createBlock(workspace, "solidity_function_definition", {
      NAME: "deposit",
      PARAMS: "",
      VISIBILITY: "external",
      MUTABILITY: "payable",
      MODIFIERS: "",
      RETURNS: "",
      DECLARATION: "FALSE",
    });
    const depositBody = createBlock(workspace, "solidity_require_statement", {
      KIND: "require",
    });
    const positiveValue = createBlock(workspace, "logic_compare", { OP: "GT" });
    connectValue(positiveValue, "A", createBlock(workspace, "solidity_environment", { VALUE: "msg.value" }));
    connectValue(positiveValue, "B", createBlock(workspace, "math_number", { NUM: "0" }));
    connectValue(depositBody, "CONDITION", positiveValue);
    connectValue(depositBody, "MESSAGE", createBlock(workspace, "solidity_string_literal", { VALUE: "No value sent" }));

    const updateBalance = balanceUpdate(workspace);
    const emitDeposit = createBlock(workspace, "solidity_emit_statement", {
      NAME: "Deposited",
      ARGS: "msg.sender, msg.value",
    });
    connectNext(depositBody, updateBalance);
    connectNext(updateBalance, emitDeposit);
    connectStatement(deposit, "BODY", depositBody);

    const close = createBlock(workspace, "solidity_function_definition", {
      NAME: "close",
      PARAMS: "",
      VISIBILITY: "external",
      MUTABILITY: "",
      MODIFIERS: "onlyOwner",
      RETURNS: "",
      DECLARATION: "FALSE",
    });
    const closeBody = createBlock(workspace, "solidity_raw_statement", {
      CODE: "selfdestruct(payable(owner));",
    });
    connectStatement(close, "BODY", closeBody);

    const receive = createBlock(workspace, "solidity_receive_definition", {
      VISIBILITY: "external",
      MUTABILITY: "payable",
    });
    const receiveBody = balanceUpdate(workspace);
    connectStatement(receive, "BODY", receiveBody);

    const fallback = createBlock(workspace, "solidity_fallback_definition", {
      PARAMS: "",
      VISIBILITY: "external",
      MUTABILITY: "payable",
      RETURNS: "",
    });

    const members = [
      event,
      error,
      struct,
      enumBlock,
      owner,
      balances,
      modifier,
      constructor,
      deposit,
      close,
      receive,
      fallback,
    ];
    members
      .slice(0, -1)
      .forEach((block, index) => connectNext(block, members[index + 1]));
    connectStatement(contract, "BODY", event);

    const source = BlocklySolidityGenerator.workspaceToCode(workspace);
    expect(source).toContain("constructor(address initialOwner)");
    expect(source).toContain("error Unauthorized(address caller);");
    expect(source).toContain("receive() external payable");
    expect(source).toContain("balances[msg.sender] += msg.value;");
    expect(source).toContain("emit Deposited(msg.sender, msg.value);");
    expect(source).toContain('require(msg.value > 0, "No value sent");');
    expect(compile(source)).toEqual([]);
  });

  it("supports every grammar production through context-safe raw blocks", () => {
    const workspace = new Blockly.Workspace();
    const source = createBlock(workspace, "solidity_raw_source", {
      CODE: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

type Wad is uint256;

function addWad(Wad left, Wad right) pure returns (Wad) {
  return Wad.wrap(Wad.unwrap(left) + Wad.unwrap(right));
}

using { addWad as + } for Wad global;

contract GrammarCoverage {
  function run(Wad value) external pure returns (Wad result) {
    assembly ("memory-safe") { let size := msize() }
    unchecked { result = value + Wad.wrap(1); }
  }
}`,
    });

    const generated = BlocklySolidityGenerator.workspaceToCode(workspace);
    expect(generated).toContain('assembly ("memory-safe")');
    expect(compile(generated)).toEqual([]);
  });
});
