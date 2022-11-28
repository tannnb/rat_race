import Vue from '../vue'

var vm = new Vue({
  el:'#app',
  data() {
    return {
      title:"标题",
      age:18,
      name:'测试名称',
      testData:{
        a:{
          b:1
        }
      },
      hobby:['唱','跳','rapp','篮球'],
      list:[
        {id:1,title:'语文'},
        {id:2,title:'数学'},
      ],
      user:{

      }
    }
  }
})

console.log(vm.testData.a)
console.log(vm);