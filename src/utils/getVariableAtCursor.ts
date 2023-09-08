import * as vscode from 'vscode'

export const getVariableAtCursor = (editor: vscode.TextEditor) => {
  const cursorPosition = editor.selection.active
  const lineText = editor.document.lineAt(cursorPosition).text
  const cursorOffset = editor.document.offsetAt(cursorPosition)

  // Assuming variables are alphanumeric with underscores
  const wordRegex = /[\w.]+/g
  let match
  let variables = []

  while ((match = wordRegex.exec(lineText)) !== null) {
    const wordStartOffset = editor.document.offsetAt(
      new vscode.Position(cursorPosition.line, match.index)
    )
    const wordEndOffset = wordStartOffset + match[0].length - 1

    if (wordStartOffset <= cursorOffset && cursorOffset <= wordEndOffset) {
      variables.push(match[0])
    }
  }

  return variables[0]
}
