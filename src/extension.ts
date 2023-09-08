// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { findImportPath } from './utils/folder'
import { getVariableAtCursor } from './utils/getVariableAtCursor'
import { openRelativeFile } from './utils/openRelativeFile'

const setUp = (textEditor: vscode.TextEditor) => {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showErrorMessage('No active text editor found.')
    return
  }

  const variable = getVariableAtCursor(editor)
  const obj = variable.split('.')
  const symbol = variable.split('.')[0]
  const property = variable.split('.')[obj.length - 1]

  const document = textEditor.document
  const importPath = findImportPath(document, symbol)

  if (!importPath) {
    vscode.window.showErrorMessage('No import path found.')
    return
  }

  return { importPath, property }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "module-locator" is now active!')

  const openInSidePane = vscode.commands.registerTextEditorCommand(
    'go-to-style.side',
    (textEditor) => {
      const base = setUp(textEditor)
      if (!base) {
        return
      }
      const { importPath, property } = base
      openRelativeFile(importPath, property, textEditor, 'side')
    }
  )

  const openInNewTab = vscode.commands.registerTextEditorCommand(
    'go-to-style.tab',
    (textEditor) => {
      const base = setUp(textEditor)
      if (!base) {
        return
      }
      const { importPath, property } = base
      openRelativeFile(importPath, property, textEditor, 'tab')
    }
  )

  context.subscriptions.push()
}

// this method is called when your extension is deactivated
export function deactivate() {}
