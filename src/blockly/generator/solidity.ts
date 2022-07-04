import Blockly, { Block } from "blockly";

import { BlocklySolidityGenerator } from "./main";
import "./contract";
import "./logic";
import "./math";
import "./methods";
import "./variables";
import "./procedures";

import "../blocks/contract";

export enum OperationOrder {
  ORDER_ATOMIC = 0, // 0 "" ...
  ORDER_NEW = 1.1, // new
  ORDER_MEMBER = 1.2, // . []
  ORDER_FUNCTION_CALL = 2, // ()
  ORDER_INCREMENT = 3, // ++
  ORDER_DECREMENT = 3, // --
  ORDER_BITWISE_NOT = 4.1, // ~
  ORDER_UNARY_PLUS = 4.2, // +
  ORDER_UNARY_NEGATION = 4.3, // -
  ORDER_LOGICAL_NOT = 4.4, // !
  ORDER_TYPEOF = 4.5, // typeof
  ORDER_VOID = 4.6, // void
  ORDER_DELETE = 4.7, // delete
  ORDER_DIVISION = 5.1, // /
  ORDER_MULTIPLICATION = 5.2, // *
  ORDER_MODULUS = 5.3, // %
  ORDER_SUBTRACTION = 6.1, // -
  ORDER_ADDITION = 6.2, // +
  ORDER_BITWISE_SHIFT = 7, // << >> >>>
  ORDER_RELATIONAL = 8, // < <= > >=
  ORDER_IN = 8, // in
  ORDER_INSTANCEOF = 8, // instanceof
  ORDER_EQUALITY = 9, // == != === !==
  ORDER_BITWISE_AND = 10, // &
  ORDER_BITWISE_XOR = 11, // ^
  ORDER_BITWISE_OR = 12, // |
  ORDER_LOGICAL_AND = 13, // &&
  ORDER_LOGICAL_OR = 14, // ||
  ORDER_CONDITIONAL = 15, // ?:
  ORDER_ASSIGNMENT = 16, // = += -= *= /= %= <<= >>= ...
  ORDER_COMMA = 17, // ,
  ORDER_NONE = 99, // (...)
}

export enum LabelGroup {
  LABEL_GROUP_STATE = "state",
  LABEL_GROUP_PARAMETER = "parameter",
  LABEL_GROUP_VARIABLE = "variable",
  LABEL_GROUP_METHOD = "method",
  UNDEFINED_NAME = "__UNDEFINED__",
}

///////////////////////////////////////////////////////////////////////////////////////////////

BlocklySolidityGenerator.addReservedWords(
  "Blockly," + // In case JS is evaled in the current window.
    "FIXME"
);

BlocklySolidityGenerator.ORDER_OVERRIDES = [
  // (foo()).bar -> foo().bar
  // (foo())[0] -> foo()[0]
  [OperationOrder.ORDER_FUNCTION_CALL, OperationOrder.ORDER_MEMBER],
  // (foo())() -> foo()()
  [OperationOrder.ORDER_FUNCTION_CALL, OperationOrder.ORDER_FUNCTION_CALL],
  // (foo.bar).baz -> foo.bar.baz
  // (foo.bar)[0] -> foo.bar[0]
  // (foo[0]).bar -> foo[0].bar
  // (foo[0])[1] -> foo[0][1]
  [OperationOrder.ORDER_MEMBER, OperationOrder.ORDER_MEMBER],
  // (foo.bar)() -> foo.bar()
  // (foo[0])() -> foo[0]()
  [OperationOrder.ORDER_MEMBER, OperationOrder.ORDER_FUNCTION_CALL],

  // !(!foo) -> !!foo
  [OperationOrder.ORDER_LOGICAL_NOT, OperationOrder.ORDER_LOGICAL_NOT],
  // a * (b * c) -> a * b * c
  [OperationOrder.ORDER_MULTIPLICATION, OperationOrder.ORDER_MULTIPLICATION],
  // a + (b + c) -> a + b + c
  [OperationOrder.ORDER_ADDITION, OperationOrder.ORDER_ADDITION],
  // a && (b && c) -> a && b && c
  [OperationOrder.ORDER_LOGICAL_AND, OperationOrder.ORDER_LOGICAL_AND],
  // a || (b || c) -> a || b || c
  [OperationOrder.ORDER_LOGICAL_OR, OperationOrder.ORDER_LOGICAL_OR],
];

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
BlocklySolidityGenerator.init = function (workspace) {
  // Create a dictionary of definitions to be printed before the code.
  BlocklySolidityGenerator.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  BlocklySolidityGenerator.functionNames_ = Object.create(null);

  if (!BlocklySolidityGenerator.nameDB_) {
    BlocklySolidityGenerator.nameDB_ = new Blockly.Names(
      //@ts-ignore
      BlocklySolidityGenerator.RESERVED_WORDS_
    );
  } else {
    BlocklySolidityGenerator.nameDB_.reset();
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
BlocklySolidityGenerator.finish = function (code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in BlocklySolidityGenerator.definitions_) {
    definitions.push(BlocklySolidityGenerator.definitions_[name]);
  }
  // Clean up temporary data.
  delete BlocklySolidityGenerator.definitions_;
  delete BlocklySolidityGenerator.functionNames_;
  BlocklySolidityGenerator.nameDB_.reset();
  return definitions.join("\n\n") + "\n\n\n" + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
BlocklySolidityGenerator.scrubNakedValue = function (line) {
  return line + ";\n";
};

// /**
//  * Encode a string as a properly escaped Solidity string, complete with
//  * quotes.
//  * @param {string} string Text to encode.
//  * @return {string} Solidity string.
//  * @private
//  */
// Blockly.Solidity.quote_ = function (string) {
//   // Can't use goog.string.quote since Google's style guide recommends
//   // JS string literals use single quotes.
//   string = string
//     .replace(/\\/g, "\\\\")
//     .replace(/\n/g, "\\\n")
//     .replace(/'/g, "\\'");
//   return "'" + string + "'";
// };

/**
 * Common tasks for generating Solidity from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Solidity code created for this block.
 * @return {string} Solidity code with comments and subsequent blocks added.
 * @private
 */
//@ts-ignore
BlocklySolidityGenerator.scrub_ = function (block: Block, code) {
  var commentCode = "";
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    comment = Blockly.utils.string.wrap(
      comment || "",
      BlocklySolidityGenerator.COMMENT_WRAP - 3
    );
    if (comment) {
      //@ts-ignore
      if (block.getProcedureDef) {
        // Use a comment block for function comments.
        commentCode +=
          "/**\n" +
          BlocklySolidityGenerator.prefixLines(comment + "\n", " * ") +
          " */\n";
      } else {
        commentCode += BlocklySolidityGenerator.prefixLines(
          comment + "\n",
          "// "
        );
      }
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type === Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          var comment = BlocklySolidityGenerator.allNestedComments(childBlock);
          if (comment) {
            commentCode += BlocklySolidityGenerator.prefixLines(comment, "// ");
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = BlocklySolidityGenerator.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Gets a property and adjusts the value while taking into account indexing.
 * @param {!Blockly.Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @param {number=} opt_order The highest order acting on this value.
 * @return {string|number}
 */
// @ts-ignore
BlocklySolidityGenerator.getAdjusted = function (
  block,
  atId,
  opt_delta,
  opt_negate,
  opt_order
) {
  var delta = opt_delta || 0;
  var order = opt_order || OperationOrder.ORDER_NONE;
  if (block.workspace.options.oneBasedIndex) {
    delta--;
  }
  var defaultAtIndex = block.workspace.options.oneBasedIndex ? "1" : "0";
  if (delta > 0) {
    var at =
      BlocklySolidityGenerator.valueToCode(
        block,
        atId,
        OperationOrder.ORDER_ADDITION
      ) || defaultAtIndex;
  } else if (delta < 0) {
    var at =
      BlocklySolidityGenerator.valueToCode(
        block,
        atId,
        OperationOrder.ORDER_SUBTRACTION
      ) || defaultAtIndex;
  } else if (opt_negate) {
    var at =
      BlocklySolidityGenerator.valueToCode(
        block,
        atId,
        OperationOrder.ORDER_UNARY_NEGATION
      ) || defaultAtIndex;
  } else {
    var at =
      BlocklySolidityGenerator.valueToCode(block, atId, order) ||
      defaultAtIndex;
  }

  if (Blockly.isNumber(at)) {
    // If the index is a naked number, adjust it right now.
    at = parseFloat(at) + delta;
    if (opt_negate) {
      at = String(-at);
    }
  } else {
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = at + " + " + delta;
      var innerOrder = OperationOrder.ORDER_ADDITION;
    } else if (delta < 0) {
      at = at + " - " + -delta;
      var innerOrder = OperationOrder.ORDER_SUBTRACTION;
    }
    if (opt_negate) {
      if (delta) {
        at = "-(" + at + ")";
      } else {
        at = "-" + at;
      }
      var innerOrder = OperationOrder.ORDER_UNARY_NEGATION;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = "(" + at + ")";
    }
  }
  return at;
};

export { BlocklySolidityGenerator };
