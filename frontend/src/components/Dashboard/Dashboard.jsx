import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [acceptMessages, setAcceptMessages] = useState(false);
  const {logout} = useAuth()

  // Function to handle copy button click
  const handleCopy = () => {
    navigator.clipboard.writeText('https://truefeedback.in/u/sachingahlot2213')
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  // Function to handle toggle switch change
  const handleToggle = () => {
    setAcceptMessages(prevState => !prevState);
  };

  const handleLogout = () =>{
logout()
  }

  return (
    <div className="w-full min-h-screen">
      {/* <nav className="p-6 md:p-8 shadow-md bg-gray-900 text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <a href="#" className="text-xl font-bold mb-4 md:mb-0">Feedback Vault</a>
          <span className="mr-4">Welcome, sachingahlot2213</span>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full md:w-auto bg-slate-100 text-black"
            onClick={() => alert('Logging out...')}
          >
            Logout
          </button>
        </div>
      </nav> */}

      <nav className='px-8 w-full text-white flex justify-between items-center bg-black  h-28 '>
       <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <a href="#" className='text-3xl font-bold'>Feedback Vault</a>
          <span className="mr-4 text-2xl">Welcome,back to your profile sachingahlot2213</span>
          <button onClick={handleLogout} className='bg-white text-black rounded px-8 py-2 text-xl'>Logout</button>
        </div>
      </nav>
      <div className="bg-white my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded w-full max-w-6xl">
        <h1 className="text-6xl font-bold mb-4">User Dashboard</h1>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Copy Your Unique Link</h2>
          <div className="flex items-center">
            <input
              disabled
              className="input text-xl input-bordered w-full p-4 mr-2"
              type="text"
              value="https://truefeedback.in/u/sachingahlot2213"
            />
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-primary/90 h-10 px-4 py-2"
              onClick={handleCopy}
            >
              Copy
            </button>
          </div>
        </div>
        <div className="mb-4">
          <button
            type="button"
            role="switch"
            aria-checked={acceptMessages}
            onClick={handleToggle}
            className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${acceptMessages ? 'bg-primary' : 'bg-input'}`}
          >
            <span
              className={`text-xl bg-gray-400   pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${acceptMessages ? 'translate-x-5' : 'translate-x-0'}`}
            ></span>
          </button>
          <span className="ml-2 text-xl ">Accept Messages: {acceptMessages ? 'On' : 'Off'}</span>
        </div>
        <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full"></div>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-4"
          onClick={() => alert('Refreshing...')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-ccw h-4 w-4">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
            <path d="M16 16h5v5"></path>
          </svg>
        </button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <p>No messages to display.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
