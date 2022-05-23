// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// const {veSequenceUtils} = require('ve-sequence-utils');
const {
  genbankToJson,
  jsonToFasta,
	jsonToGenbank,
	fastaToJson,
  jsonToBed,
  snapgeneToJson
} = require("bio-parsers");

const {
  getAminoAcidStringFromSequenceString,
  getComplementSequenceString,
  getDegenerateDnaStringFromAAString,
  getReverseComplementSequenceString,
  getReverseSequenceString,
  calculateTm,
  calculatePercentGC
} = require("ve-sequence-utils");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vscode-bio-utils" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.convertSnapgeneToGenbank",
      function() {
        // The code you place here will be executed every time your command is executed
        return replaceSelectionOrFilePromise(text => {
          return snapgeneToJson(text).then(results => {
            return jsonToGenbank(results[0].parsedSequence);
          });
        });
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.convertFastaToGenbank",
      function() {
        // The code you place here will be executed every time your command is executed
        return replaceSelectionOrFilePromise(text => {
          return fastaToJson(text).then(results => {
            return jsonToGenbank(results[0].parsedSequence);
          });
        });
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.convertGenbankToTeselagenJson",
      function() {
        // The code you place here will be executed every time your command is executed
        return replaceSelectionOrFilePromise(text => {
          return genbankToJson(text).then(results => {
            return JSON.stringify(results[0].parsedSequence, null, 2);
          });
        });
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.convertGenbankToFasta",
      function() {
        // The code you place here will be executed every time your command is executed
        return replaceSelectionOrFilePromise(text => {
          return genbankToJson(text).then(results => {
            return jsonToFasta(results[0].parsedSequence);
          });
        });
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.convertGenbankToBed",
      function() {
        // The code you place here will be executed every time your command is executed
        return replaceSelectionOrFilePromise(text => {
          return genbankToJson(text).then(results => {
            return jsonToBed(results[0].parsedSequence);
          });
        });
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.getAminoAcidStringFromSequenceString",
      function() {
        // The code you place here will be executed every time your command is executed
        replaceSelections(text => {
          return getAminoAcidStringFromSequenceString(text);
        });
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.getComplementSequenceString",
      function() {
        // The code you place here will be executed every time your command is executed
        replaceSelections(text => {
          return getComplementSequenceString(text);
        });
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.getReverseComplementSequenceString",
      function() {
        // The code you place here will be executed every time your command is executed
        replaceSelections(text => {
          return getReverseComplementSequenceString(text);
        });
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.getReverseSequenceString",
      function() {
        // The code you place here will be executed every time your command is executed
        replaceSelections(text => {
          return getReverseSequenceString(text);
        });
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.getDegenerateDnaStringFromAAString",
      function() {
        // The code you place here will be executed every time your command is executed
        replaceSelections(text => {
          return getDegenerateDnaStringFromAAString(text);
        });
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.translate", function() {
      // The code you place here will be executed every time your command is executed
      replaceSelections(text => {
        return getReverseComplementSequenceString(text);
      });
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.calculateTm", function() {
      // The code you place here will be executed every time your command is executed
      replaceSelections(text => {
        return calculateTm(text).toString();
      });
      return;
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.calculatePercentGC", function() {
      // The code you place here will be executed every time your command is executed
      replaceSelections(text => {
        return calculatePercentGC(text).toString();
      });
      return;
    })
  );
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};

function replaceSelections(fn) {
  var editor = vscode.window.activeTextEditor;
  if (!editor) {
    return; // No open text editor
  }
  editor.edit(editBuilder => {
    vscode.window.activeTextEditor.selections.forEach(selection => {
      var text = editor.document.getText(selection);
      const toReplace = fn(text);
      editBuilder.replace(selection, toReplace);
    });
  });
}
function replaceSelectionOrFilePromise(fn) {
  var editor = vscode.window.activeTextEditor;
  if (!editor) {
    return; // No open text editor
  }
  var { selection } = vscode.window.activeTextEditor;
  var text;
  if (selection && !selection.isEmpty) {
    text = editor.document.getText(selection);
  } else {
    text = editor.document.getText();
    selection = new vscode.Range(
      editor.document.positionAt(0),
      editor.document.positionAt(text.length - 1)
    );
  }

  fn(text).then(val => {
    editor.edit(editBuilder => {
      editBuilder.replace(selection, val);
    });
  });
}
