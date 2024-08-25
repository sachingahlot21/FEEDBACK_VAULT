import React from 'react'
import { Link } from 'react-router-dom'

export default function Signup() {
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
          <form className='  mb-2 h-[85%]'>
            <div className='h-[27%]   flex flex-col'>
              <label className='text-2xl' htmlFor="">Username</label>
              <input className='border border-1px-solid h-[50%] rounded mt-2' type='text'></input>
            </div>

            <div className='h-[27%]   flex flex-col'>
              <label className='text-2xl' htmlFor="">Email</label>
              <input className='border border-1px-solid h-[50%] rounded mt-2' type='text'></input>
            </div>

            <div className='mt-2 h-[27%]  flex flex-col'>
              <label className='text-2xl' htmlFor="">Password</label>
              <input className='border border-1px-solid rounded h-[50%] mt-2' type='password'></input>
            </div>
            <div className='h-[15%] '>
              <button className='w-[100%] text-white text-xl bg-black h-[90%] rounded-md mt-2 '>Signup</button>
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
