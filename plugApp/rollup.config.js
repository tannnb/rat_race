import pkg from './package.json'

// 让rollup打包的时候采用babel
import babel from 'rollup-plugin-babel'
import typescript from '@rollup/plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  // 打包入口
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'esm'
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'runtimeTools'
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    commonjs(),
    resolve()
  ]
}
