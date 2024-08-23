import { useCallback, useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState("")
  const[res, setRes]= useState("")

  const [data, setData] = useState([
    { name: "sachin", email: "sachin@gmail.com" }, 
    { name: "ritik", email: "ritik@gmail.com" }])

  function handleSearch() {
    const query = count.toLowerCase()
    const answer = data.filter((e)=>(
         e.name.toLowerCase() == query || e.email.toLowerCase() ==query
    ))
    setRes(answer)
  }

  function handleSearchh() {
    console.log(res)
  }

  return (
    <>
      <input type='text' value={count} onChange={(e) => setCount(e.target.value)}></input>
      <button onClick={handleSearch}>Search</button>
      <button  onClick={handleSearchh}>Handle</button>

    </>
  )
}

export default App
