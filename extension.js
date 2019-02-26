// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// const {veSequenceUtils} = require('ve-sequence-utils');
const {
  getAminoAcidStringFromSequenceString,
	getComplementSequenceString,
	getDegenerateDnaStringFromAAString,
	getReverseComplementSequenceString,
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
    vscode.commands.registerCommand("extension.getAminoAcidStringFromSequenceString", function() {
      // The code you place here will be executed every time your command is executed
      replaceSelections(text => {
        return getAminoAcidStringFromSequenceString(text);
      });
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.getComplementSequenceString", function() {
      // The code you place here will be executed every time your command is executed
      replaceSelections(text => {
        return getComplementSequenceString(text);
      });
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.getReverseComplementSequenceString", function() {
      // The code you place here will be executed every time your command is executed
      replaceSelections(text => {
        return getReverseComplementSequenceString(text);
      });
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.getDegenerateDnaStringFromAAString", function() {
      // The code you place here will be executed every time your command is executed
      replaceSelections(text => {
        return getDegenerateDnaStringFromAAString(text);
      });
    })
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
