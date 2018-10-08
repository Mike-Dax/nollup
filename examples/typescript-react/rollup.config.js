import autoExternal from 'rollup-plugin-auto-external'
import path from 'path'
import typescript from 'rollup-plugin-typescript'

export default async a => {
  return {
    input: 'src/main.tsx',
    output: [
      { format: 'cjs', file: path.resolve(__dirname, 'lib', `main.js`) },
    ],
    plugins: [
      autoExternal({
        builtins: true,
        dependencies: true,
        packagePath: path.resolve(__dirname, 'package.json'),
        peerDependencies: true,
      }),
      typescript(),
    ],
  }
}
