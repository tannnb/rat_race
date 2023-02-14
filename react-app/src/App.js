import './App.css';
import { useEffect } from 'react';
import DataUrl from './components/DataUrl';

function App () {

  return (
    <div className="App">
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