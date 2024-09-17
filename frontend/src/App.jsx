import './App.css'
import Login from './components/Login/Login'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup/Signup'
import Home from './components/Home/Home'
import Dashboard from './components/Dashboard/Dashboard'
import { useEffect, useState } from 'react';
import { useAuth, AuthProvider } from './context/AuthContext';
import Public from './components/Public/Public';
import { useNavigate } from 'react-router-dom';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setAuthToken } = useAuth()

  const navigate = useNavigate()

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (token) => {
    sessionStorage.setItem('token', token);
    setAuthToken(token)
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    navigate('/')
    setIsAuthenticated(false);
  };

  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login handleLogin={login} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/public/:username" element={<Public />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard handleLogout={logout} /> : <Navigate to="/login" />}
        />
      </Routes>
  
  )
}

export default App
