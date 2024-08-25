import './App.css'
import Login from './components/Login/Login'
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import Signup from './components/Signup/Signup'
import Home from './components/Home/Home'
import Dashboard from './components/Dashboard/Dashboard'
import { useState } from 'react';
function App() {

const[isAuthenticated , setIsAutenticated] = useState(false)
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
