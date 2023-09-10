// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { findImportPath } from './utils/folder'
import { getVariableAtCursor } from './utils/getVariableAtCursor'
import { openRelativeFile } from './utils/openRelativeFile'

const openStyle = (
  textEditor: vscode.TextEditor,
  viewColumn: 'side' | 'tab'
) => {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showErrorMessage('No active text editor found.')
    return
  }

  const variable = getVariableAtCursor(editor)
  const obj = variable.split('.')
  if (obj.length < 2) {
    vscode.window.showErrorMessage('No css module found.')
    return
  }
  const symbol = variable.split('.')[0]
  const property = variable.split('.')[obj.length - 1]

  const document = textEditor.document
  const importPath = findImportPath(document, symbol)

  if (typeof importPath === 'object') {
    vscode.window.showErrorMessage(importPath.error)
    return
  }

  openRelativeFile(importPath, property, viewColumn)
}

export function activate(context: vscode.ExtensionContext) {
  const openInSidePane = vscode.commands.registerTextEditorCommand(
    'go-to-style.side',
    (textEditor) => {
      openStyle(textEditor, 'side')
    },
    {
      undoStopBefore: false,
      undoStopAfter: false,
    }
  )

  const openInNewTab = vscode.commands.registerTextEditorCommand(
    'go-to-style.tab',
    (textEditor) => {
      openStyle(textEditor, 'tab')
    },
    {
      undoStopBefore: false,
      undoStopAfter: false,
    }
  )

  //dispose subscriptions on deactivation
  context.subscriptions.push(openInSidePane, openInNewTab)
}

// this method is called when your extension is deactivated
export function deactivate() {}
