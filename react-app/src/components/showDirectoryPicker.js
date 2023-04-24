import './App.css';
import { useEffect, useReducer } from 'react';
import DataUrl from './components/DataUrl';








function App () {
  const handleFile = async () => {
    try {
      const handle = await window.showDirectoryPicker()
      const root = await processHandle(handle)
      console.log('root:', root)
    } catch {
      console.log('用户拒绝')
    }
  }

  async function processHandle (handle) {
    if (handle.kind === 'file') {
      return handle
    }
    handle.children = []
    const iter = handle.entries()
    for await (const item of iter) {
      handle.children.push(await processHandle(item[1]))
    }
    return handle
  }

  return (
    <div className="App">
      <button onClick={() => handleFile()}>打开文件</button>
    </div>
  );
}

export default App;



