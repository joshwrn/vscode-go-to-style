import * as vscode from 'vscode'
import { countFoldersUp, removeFoldersDown, removeFoldersUp } from './folder'
import path = require('path')

export const openRelativeFile = async (
  relativePath: string,
  property: string,
  editor: vscode.TextEditor,
  viewColumn: 'side' | 'tab'
) => {
  const documentPath = vscode.window.activeTextEditor?.document.uri.fsPath
  if (!documentPath) {
    vscode.window.showErrorMessage('No active text editor found.')
    return
  }
  const foldersUp = countFoldersUp(relativePath)
  const relativePathWithoutUp = removeFoldersUp(relativePath)
  const baseFolder = removeFoldersDown(documentPath, foldersUp)

  const absolutePath = path.join(baseFolder, relativePathWithoutUp)

  const doc = await vscode.workspace.openTextDocument(absolutePath)

  vscode.window
    .showTextDocument(doc, {
      preview: viewColumn === 'side' ? true : false,
      viewColumn:
        viewColumn === 'side'
          ? vscode.ViewColumn.Beside
          : vscode.ViewColumn.Active,
    })
    .then((e) => {
      const document = e.document
      const text = document.getText()

      // Find the position of the text within the document
      const position = document.positionAt(text.indexOf(`.${property}`))

      let sel = new vscode.Selection(
        new vscode.Position(position.line, position.character),
        new vscode.Position(
          position.line,
          position.character + property.length + 1
        )
      )

      e.selection = sel
      vscode.commands
        .executeCommand('cursorMove', {
          to: 'up',
          by: 'line',
          value: 100000,
        })
        .then(() =>
          vscode.commands.executeCommand('cursorMove', {
            to: 'down',
            by: 'line',
            value: position.line,
          })
        )
    })
}
