import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { BrowserRouter as Router, useNavigate, Route, Routes, Navigate } from 'react-router-dom';

export default function Signup() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username,
      email,
      password
    }
    try {
      const response = await axios.post('http://localhost:3000/signup', data)
      if (response.status > 200) {
        navigate('/login')
        setUsername('');
        setEmail('');
        setPassword('');
      }
      else {
        alert("failed to register...")
        setUsername('');
        setEmail('');
        setPassword('');
      }
    }
    catch (error) {
      console.log("signup error", error)
    }
  }

  return (
    <div className=' w-full  flex justify-center  items-center h-screen bg-black'>
      <div className='w-full   h-[100%] bg-white '>

        <div className='h-[25%] flex justify-center items-center p-2 bg-gray-100  '>
          <div>
            <h1 className='text-6xl text-center font-bold'>Join Feedback Vault</h1>
            <p className='text-xl mt-4 text-center'>Sign up to start your anonymous adventure</p>
          </div>
        </div>

        <div className='h-[65%] w-[80%] md:w-[25%] m-auto  p-2'>

          <form onSubmit={handleSubmit} className='mb-2 h-[85%]'>
            <div className='h-[27%] flex flex-col'>
              <label className='text-2xl' htmlFor='username'>Username</label>
              <input
                id='username'
                className='border border-gray-300 h-[50%] rounded mt-2 px-2'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Enter your username'
              />
            </div>

            <div className='h-[27%] flex flex-col'>
              <label className='text-2xl' htmlFor='email'>Email</label>
              <input
                id='email'
                className='border border-gray-300 h-[50%] rounded mt-2 px-2'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
              />
            </div>

            <div className='mt-2 h-[27%] flex flex-col'>
              <label className='text-2xl' htmlFor='password'>Password</label>
              <input
                id='password'
                className='border border-gray-300 rounded h-[50%] mt-2 px-2'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
              />
            </div>

            <div className='h-[15%]'>
              <button type='submit' className='w-[100%] text-white text-xl bg-black h-[90%] rounded-md mt-2'>
                Signup
              </button>
            </div>
          </form>

          <h1 className='h-[15%]   text-xl flex justify-center items-center text-center '>Already a member ? <Link to={'/login'} ><span>&nbsp;Sigin</span></Link></h1>
        </div>

        <div className='h-[10%] flex justify-center items-center p-2 bg-gray-100  '>
          <h1 className='text-xl '>All &#169; 2024, Feedback Vault. All Rights Reserved.</h1>
        </div>

      </div>
    </div>
  )
}
