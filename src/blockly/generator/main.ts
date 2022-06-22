import Blockly from "blockly";
import { LabelGroup } from "./solidity";

interface SolidityGenerator extends Blockly.Generator {
  variableDB_?: any;
}

export const BlocklySolidityGenerator: SolidityGenerator =
  new Blockly.Generator("Solidity");

const getAllVariables = function (workspace) {
  return workspace.getAllVariables();
};

const variableIsInScope = function (variable, scope) {
  while (!!scope && scope.id !== variable.scope.id) {
    var type = scope.type;
    do {
      scope = scope.getParent();
    } while (scope && type === scope.type);
  }

  return !!scope;
};

const getVariablesInScope = function (block, group = null) {
  return getAllVariables(block.workspace)
    .filter(function (v) {
      return variableIsInScope(v, block);
    })
    .filter(function (v) {
      return !group || v.group === group;
    });
};

const setVariableName = function (variable, name) {
  variable.name = '_scope("' + variable.scope.id + '")_' + name;
};

export const getVariableName = function (variable) {
  return variable.name.replace('_scope("' + variable.scope.id + '")_', "");
};

export const getVariableByNameAndScope = function (name, scope, group = null) {
  return getVariablesInScope(scope, group).filter(function (v) {
    return getVariableName(v) === name;
  })[0];
};

export const getVariableById = function (workspace, id) {
  return workspace.getVariableById(id);
};

export const getVariableByName = function (workspace, name) {
  return getAllVariables(workspace).filter(function (v) {
    return getVariableName(v) === name;
  })[0];
};

export const createVariable = function (
  workspace,
  group,
  type,
  name,
  scope,
  id
) {
  var variable = workspace.createVariable(name, type, id);

  variable.group = group;
  variable.scope = scope;

  setVariableName(variable, name);

  return variable;
};

export const updateWorkspaceNameFields = function (workspace) {
  var blocks = workspace.getAllBlocks();
  for (var i = 0; i < blocks.length; ++i) {
    var nameField = blocks[i].getVariableNameSelectField
      ? blocks[i].getVariableNameSelectField()
      : null;
    var group = blocks[i].getVariableLabelGroup
      ? blocks[i].getVariableLabelGroup()
      : null;

    if (!!nameField && !!group) {
      var vars = getVariablesInScope(blocks[i], group);
      var options = vars.map(function (v) {
        return [getVariableName(v), v.id_];
      });

      var selectedOption = nameField.getValue();

      if (options.length !== 0) {
        var wasUndefined =
          nameField.menuGenerator_[0][1] === LabelGroup.UNDEFINED_NAME;

        nameField.menuGenerator_ = options;
        if (wasUndefined) {
          nameField.setValue(options[0][1]);
        } else {
          nameField.setValue(selectedOption);
          // The text input does not redraw/update itself after we call "setValue",
          // so we set the text manually.
          nameField.setValue(
            options.filter(function (o) {
              return o[1] === selectedOption;
            })[0][0]
          );
        }
      }
    }
  }
};

const updateWorkspaceTypes = function (
  workspace,
  nameFieldName,
  valueFieldName
) {
  var blocks = workspace.getAllBlocks();
  var vars = workspace.getAllVariables();

  for (var i = 0; i < blocks.length; ++i) {
    var stateNameField = blocks[i].getField(nameFieldName);

    if (!stateNameField) {
      continue;
    }

    var variableId = blocks[i].getFieldValue(nameFieldName);
    var variable = workspace.getVariableById(variableId);

    if (!variable) {
      return;
    }

    if (
      blocks[i].inputList[0] &&
      blocks[i].inputList[0].name === valueFieldName
    ) {
      switch (variable.type) {
        case "TYPE_BOOL":
          blocks[i].inputList[0].setCheck("Boolean");
          break;
        case "TYPE_INT":
          blocks[i].inputList[0].setCheck("Number");
          break;
        case "TYPE_UINT":
          blocks[i].inputList[0].setCheck("Number");
          break;
        default:
      }
    }
    // FIXME: update the output type
  }
};

export const updateWorkspaceStateTypes = function (workspace) {
  updateWorkspaceTypes(workspace, "STATE_NAME", "STATE_VALUE");
};

export const updateWorkspaceParameterTypes = function (workspace) {
  updateWorkspaceTypes(workspace, "PARAM_NAME", "PARAM_VALUE");
};

const deleteVariableByName = function (workspace, name) {
  return workspace.deleteVariable(name);
};

export const deleteVariableById = function (workspace, id) {
  deleteVariableByName(workspace, getVariableById(workspace, id).name);
};
