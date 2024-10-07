import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { BrowserRouter as Router, useNavigate, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate()

  const notifysignupUnSuccess = (error_id) => {
    if (error_id === 'signup_error_1')
      toast("Username already taken");
    else if (error_id === 'signup_error_2')
      toast("User already exist with this email");
    else if (error_id === 'signup_error_3')
      toast("Error occured while sending verification code");
    else if (error_id === 'signup_error_4')
      toast("User creation or update failed");
    else if (error_id === 'signup_error_5')
      toast("Error! User registration failed...");

    //signup_form_validations_errors
    else if (error_id === 'signup_error_6')
      toast("Invalid Email...");
    else if (error_id === 'signup_error_7')
      toast("Length of password must be greater than or equal to 8");
    else if (error_id === 'signup_error_8')
      toast("Your user name is not valid. Only characters A-Z, a-z and '-' are  acceptable.");
  }

  //function_to_handleValidation
  const handleSubmit = (e) => {
    e.preventDefault()
    let isValid = true

    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
    const userNameRegex = /^[a-zA-Z\-]+$/
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/

    if (!emailRegex.test(email)) {
      console.log("Not a valid email")
      notifysignupUnSuccess('signup_error_6')
      isValid = false
    }
    if (!passwordRegex.test(password)) {
      console.log("Length of password must be greater than or equal to 8")
      notifysignupUnSuccess('signup_error_7')
      isValid = false
    }
    if (!userNameRegex.test(username)) {
      console.log("Your user name is not valid. Only characters A-Z, a-z and '-' are  acceptable.")
      notifysignupUnSuccess('signup_error_8')
      isValid = false
    }
    if (isValid) {
      handleFormSubmit()
    }
    else {
      console.log("error in submitting form")
    }
  }

  //function_to_handling_api
  const handleFormSubmit = async () => {


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

      if (error.response.data.errorId === "signup_error_1") {
        notifysignupUnSuccess("signup_error_1")
      }
      else if (error.response.data.errorId === "signup_error_2") {
        notifysignupUnSuccess("signup_error_2")
      }
      else if (error.response.data.errorId === "signup_error_3") {
        notifysignupUnSuccess("signup_error_3")
      }
      else if (error.response.data.errorId === "signup_error_4") {
        notifysignupUnSuccess("signup_error_4")
      }
      else {
        notifysignupUnSuccess("signup_error_5")
      }
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

        <ToastContainer
          autoClose={3000}
          hideProgressBar={true}
        />
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
