import './App.css';
import { useEffect, useReducer } from 'react';
import DataUrl from './components/DataUrl';








function App () {

  const [state, dispatch] = useReducer((state, next) => ({ ...state, ...next }), {
    id: 1,
    name: '测试一下'
  })

  useEffect(() => {
    console.log('id变化了:', state.id)
  }, [state.id])

  console.log('state', state)

  return (
    <div className="App">
      <button onClick={() => dispatch({ id: state.id + 1 ,name:'测试2'})}>123123</button>
      <DataUrl></DataUrl>
    </div>
  );
}

export default App;


function chunk (array, size = 1) {
  if (size < 1) {
    return []
  }
  const result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}


