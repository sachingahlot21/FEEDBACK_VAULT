import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Public() {
  const { username } = useParams();
  const [messagesFromAI, setMessagesFromAI] = useState(["What's your favorite movie?", "Do you have any pets?", "What's your dream job?"])
  const [message, setMessage] = useState("")
  
  const data = {
    "username": username,
    "content": message
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const response = await axios.post('http://localhost:3000/send-message', data)
      if (response.status === 201) {
        console.log("sent")
      }
      else {
        alert("failed to send...")
      }
  

    }
    catch(err){
      console.log(err)
    }
    
  }

  return (
    <div className="w-full min-h-screen bg-white text-black p-8">

      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Public Profile Link</h1>

        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Send Anonymous Message to {username}</h2>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            className="w-full p-3 border border-gray-300 bg-white text-black rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button onClick={handleSubmit} className="w-full bg-gray-300 text-black p-3 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-black">
            Send It
          </button>
        </div>
      </section>

      <section className="mb-8">
        <button className="bg-gray-300 text-black p-3 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-black mb-4">
          Suggest Messages
        </button>
        <h2 className="text-xl font-semibold mb-4">Click on any message below to select it.</h2>
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Messages</h3>
          <div className="space-y-2">
            {messagesFromAI.map((msg, index) => (
              <span key={index} className="block p-3 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer">
                {msg}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Get your Message Board</h2>
        <Link to={'/signup'} className="bg-gray-300 text-black p-3 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-black">
          Create Your Account
        </Link>
      </section>
    </div>
  )
}

export default Public