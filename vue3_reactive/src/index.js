import {reactive} from './vue3/reactivity'

 const student = reactive({
  name:'小明',
  info:{
    age:22,
    sex:'男'
  },
  hobbry:['唱','跳','rapp','篮球']
})

student.hobbry.push('coding')