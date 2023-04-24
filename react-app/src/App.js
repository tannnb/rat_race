import './App.css';
import { useEffect, useReducer } from 'react';


function App () {

  useEffect(() => {
    const container = document.querySelector('.App')
    container.addEventListener('dragenter',(e) => {
      e.preventDefault()
      console.log('进入')
    })
    container.addEventListener('dragover',(e) => {
      e.preventDefault()
      console.log('进入2')
    })
    container.addEventListener('drop',(e) => {
      e.preventDefault()
      console.log('放开',e.dataTransfer.files )
    })
  },[])

  return (
    <div className="App">
      <input type="file" className='fileClass' />
    </div>
  );
}

export default App;




