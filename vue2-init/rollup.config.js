
// 让rollup打包的时候采用babel
import babel from 'rollup-plugin-babel'

export default {
  // 打包入口
  input:'./src/index.js',
  output:{
    // 打包后的文件存放在output中
    file:"dist/vue.js",
    // 统一模块规范，支持 commonjs,amd (window.Vue)
    format:'umd',
    name:'Vue',
    // 为了增加调试功能
    sourcemap:true
  },
  plugins:[
    babel({
      // 不编译node_modules下的文件夹
      exclude:'node_modules/**'
    })
  ]
}