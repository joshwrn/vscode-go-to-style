import * as vscode from 'vscode'
import path = require('path')

export const findTypeScriptPath = (cssModulePath: string) => {
  // get workspace folder
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
  if (!workspaceFolder) {
    return
  }

  // get tsconfig.json
  const tsconfigPath = path.join(workspaceFolder.uri.fsPath, 'tsconfig.json')
  const tsconfig = require(tsconfigPath)

  if (!tsconfig) {
    return
  }

  // get compilerOptions.paths
  const paths = tsconfig.compilerOptions.paths
  if (!paths) {
    return
  }

  for (const [key, value] of Object.entries(paths)) {
    const alias = key.replace('/*', '')

    const paths = value as string[]

    if (cssModulePath.startsWith(alias)) {
      const newPath = cssModulePath.replace(alias, paths[0].replace('/*', ''))
      return { newPath, workspaceFolder }
    }
  }
}
