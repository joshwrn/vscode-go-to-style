import * as vscode from 'vscode'
import { countFoldersUp, removeFoldersDown, removeFoldersUp } from './folder'
import path = require('path')
import { findTypeScriptPath } from './findTypescriptPath'

export const openModuleFile = async (
  relativePath: string,
  property: string,
  viewColumn: 'side' | 'tab'
) => {
  const documentPath = vscode.window.activeTextEditor?.document.uri.fsPath
  if (!documentPath) {
    vscode.window.showErrorMessage('No active text editor found.')
    return
  }

  let absolutePath: string

  const tsPath = findTypeScriptPath(relativePath)

  if (tsPath) {
    const { newPath, workspaceFolder } = tsPath
    const baseFolder = workspaceFolder.uri.fsPath
    absolutePath = path.join(baseFolder, newPath)
  } else {
    const foldersUp = countFoldersUp(relativePath)
    const relativePathWithoutUp = removeFoldersUp(relativePath)
    const baseFolder = removeFoldersDown(documentPath, foldersUp)
    absolutePath = path.join(baseFolder, relativePathWithoutUp)
  }

  const doc = await vscode.workspace.openTextDocument(absolutePath)

  const cssModuleFile = await vscode.window.showTextDocument(doc, {
    preview: viewColumn === 'side' ? true : false,
    viewColumn:
      viewColumn === 'side'
        ? vscode.ViewColumn.Beside
        : vscode.ViewColumn.Active,
  })

  const document = cssModuleFile.document
  const text = document.getText()

  // Find the position of the text within the document
  // regex only matches property without preceding whitespace
  const regexp = new RegExp(`(?<![ \t])${'.' + property}`, 'gm')
  const index = text.search(regexp)
  const position = document.positionAt(index)

  const sel = new vscode.Selection(
    new vscode.Position(position.line, position.character),
    new vscode.Position(position.line, position.character + property.length + 1)
  )

  cssModuleFile.selection = sel

  await vscode.commands.executeCommand('cursorMove', {
    to: 'up',
    by: 'line',
    value: 100000,
  })
  await vscode.commands.executeCommand('cursorMove', {
    to: 'down',
    by: 'line',
    value: position.line,
  })
}
