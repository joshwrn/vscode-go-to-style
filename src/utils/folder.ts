import * as vscode from 'vscode'

export function findImportPath(
  document: vscode.TextDocument,
  variableName: string
) {
  const text = document.getText()
  const importPattern = new RegExp(
    `import .*\\b${variableName}\\b.*['"](.*)['"]`,
    'g'
  )
  let match
  while ((match = importPattern.exec(text)) !== null) {
    const importPath = match[1]
    return importPath
  }
  return null
}

export function countFoldersUp(filePath: string): number {
  const segments = filePath.split('/')
  let count = 0

  for (const segment of segments) {
    if (segment === '..') {
      count++
    }
  }

  return count
}

export const removeFoldersDown = (filePath: string, count: number): string => {
  const segments = filePath.split('/')
  const newSegments = segments.slice(0, segments.length - (count + 1))
  return newSegments.join('/')
}

// removes all instances of '../' from the beginning of the string
export const removeFoldersUp = (filePath: string): string => {
  const fp = filePath.replace(/^(\.\.\/)+/, '')
  return fp
}
