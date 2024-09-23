import React from 'react'
import { Link } from 'react-router-dom'
import { RiMessage2Line } from "react-icons/ri";


export default function Home() {
    return (
        <div className='w-full h-screen flex flex-col'>
        <nav className='px-4 sm:px-8 w-full text-white flex justify-between items-center bg-black h-16'>
          <h1 className='text-2xl sm:text-3xl font-bold'>Feedback Vault</h1>
          <Link to={'/login'}>
            <button className='bg-white text-black rounded px-4 sm:px-8 py-2 text-lg sm:text-xl'>
              Login
            </button>
          </Link>
        </nav>
  
        <main className='flex-grow flex items-center flex-col bg-[rgb(31,41,55)] text-white p-4'>
          <h1 className='text-4xl sm:text-6xl mt-16 font-bold text-center'>
            Dive into the World of Anonymous Feedback
          </h1>
          <p className='text-xl sm:text-3xl mt-6 text-center'>
            Feedback Vault - Where your identity remains a secret.
          </p>
          <div className='p-6 mt-24 w-full sm:w-[50%] rounded-md bg-white text-black'>
            <h1 className='text-3xl sm:text-4xl font-bold'>Message from SecretAdmirer</h1>
            <div className='flex mt-4 gap-4 items-start'>
              <span className='text-3xl sm:text-4xl pt-[2px]'>
                <RiMessage2Line />
              </span>
              <div>
                <p className='text-lg sm:text-2xl'>
                  I really liked your recent post!
                </p>
                <span className='text-sm sm:text-base'>2 hours ago</span>
              </div>
            </div>
          </div>
        </main>
  
        <footer className='w-full text-sm sm:text-xl flex justify-center items-center h-16 bg-black text-white'>
          © 2023 Feedback Vault. All rights reserved.
        </footer>
      </div>
  
    )
}
