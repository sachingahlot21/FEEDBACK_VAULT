import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios';
import { BrowserRouter as Router, useNavigate, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext'

export default function Login({ onLogin }) {
  const [userId, setUserId] = useState('')
  const [userPassword, setUserPassword] = useState('')

  const { setUserIDContext, setUserNameContext } = useUser()
  const { login } = useAuth();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: userId,
      password: userPassword
    }
    try {
      const response = await axios.post('http://localhost:3000/signin', data)
      if (response.status > 200) {

        console.log("res", response.data.user._id)
        console.log("res", response.data.user.username)
        setUserNameContext(response.data.user.username)
        setUserIDContext(response.data.user._id)
        login('123')
        navigate('/dashboard')
        setUserId('')
        setUserPassword('')

      }
      else {
        alert("failed to register...")
        setUserId('')
        setUserPassword('')
      }
    }
    catch (error) {
      console.log("signup error", error)
    }
  }

  return (
    <div className=' w-full  flex justify-center  items-center h-screen bg-black'>
      <div className='w-full   h-[100%] bg-white '>

        <div className='h-[40%] flex justify-center items-center p-2 bg-gray-100  '>
          <div>
            <h1 className='text-6xl text-center font-bold'>Welcome to Feedback Vault</h1>
            <p className='text-xl mt-4 text-center'>Sign in to continue your secret conversations</p>
          </div>
        </div>

        <div className='h-[50%] w-[80%] md:w-[25%] m-auto  p-2'>
          <form onSubmit={handleSubmit} className='h-[80%]'>
            <div className='h-[40%]   flex flex-col'>
              <label className='text-2xl' htmlFor="userid">Email/Username</label>
              <input className='border border-1px-solid h-[50%] rounded mt-2'
                type='text'
                id='userid'
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              ></input>
            </div>
            <div className='mt-2 h-[40%]  flex flex-col'>
              <label className='text-2xl' htmlFor="password">Password</label>
              <input id='password' className='border border-1px-solid rounded h-[50%] mt-2'
                type='password'
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              ></input>
            </div>
            <div className='h-[20%]'>
              <button type='submit' className='w-[100%] text-white text-xl bg-black h-[90%] rounded-md mt-2 '>Login</button>
            </div>
          </form>

          <h1 className='text-xl flex justify-center items-center text-center h-[20%] '>Not a member yet ? <Link to={'/signup'}><span>&nbsp;Signup</span>
          </Link>
          </h1>

        </div>

        <div className='h-[10%] flex justify-center items-center p-2 bg-gray-100  '>
          <h1 className='text-xl '>All &#169; 2024, Feedback Vault. All Rights Reserved.</h1>
        </div>

      </div>
    </div>
  )
}
