import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className='w-full h-screen'>

            <nav className='px-8 w-full text-white flex justify-between items-center bg-black  h-[15%] '>
                <h1 className='text-3xl font-bold'>Feedback  Vault</h1>
               
                <Link to={'/login'}>
                <button className='bg-white text-black rounded px-8 py-2 text-xl' >
                Login
                </button>
                </Link>
              
            </nav>

            <main className='h-[75%] flex  items-center flex-col bg-[rgb(31,41,55)] text-white'>
                <h1 className='text-6xl mt-16 font-bold' >Dive into the World of Anonymous Feedback</h1>
                <p className='text-3xl mt-6'>Feedback Vault  - Where your identity remains a secret.</p>
                <div className='mt-16 h-[30%] bg-white w-[60%]'>

                </div>
            </main>

            <footer className='w-full text-xl flex justify-center items-center h-[10%] bg-black text-white' >
                © 2023 Feedback Vault. All rights reserved.
            </footer>
        </div>
    )
}
