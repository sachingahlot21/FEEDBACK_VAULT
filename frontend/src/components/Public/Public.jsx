import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import axios from 'axios';

// require('dotenv').config();

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Public() {

  const { username } = useParams();

  const [messagesFromAI, setMessagesFromAI] = useState([
    'What hidden talent do you possess?',
    'What’s a book you’ve re-read multiple times?',
    'What’s a small act of kindness that impacted you?'
  ])
  const [message, setMessage] = useState("")
  const [wait, setWait] = useState(false)

  const data = {
    "username": username,
    "content": message
  }

  const notifySuccess = () => toast("Message sent successfully !");
  const notifyFailed = () => toast("Error occured / User Not Acceping Messages !");
  const tooManyReq = () => toast("Too Many Requests !")
  const min12Length = () => toast("Message must be at least 12 characters.")

  const handleSubmit = async (e) => {

    e.preventDefault()
   
    if(data.content.length < 12){
      min12Length()
      return
    }
    setWait(true)
    try {
      const response = await axios.post('http://localhost:3000/send-message', data)
      if (response.status === 201) {
        setMessage("")
        notifySuccess()
        setWait(false)
      }
      else {
        notifyFailed()
        setWait(false)
      }
    }
    catch (err) {
      console.log(err)
      notifyFailed()
      setWait(false)
    }

  }

  const handleSugguestMessages = async () => {

    let api_key = import.meta.env.VITE_gemini_api_key

    try {
      const response = await axios(
        {
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api_key}`,
          method: "post",
          data: {
            contents: [{ parts: [{ text: "Create a array of three open-ended and engaging questions formatted as a single string in double . Length of the question should be between 7-10 words. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this in an array: ['What’s a hobby you’ve recently started?' , 'If you could have dinner with any historical figure, who would it be? ' , 'What’s a simple thing that makes you happy?']. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment." }] }],
          }
        })

      // console.log(response.data.candidates[0].content.parts[0].text)

      // console.log('API Response:', response.data.candidates[0].content.parts[0].text);
      // // console.log('Type of response.data:', typeof(JSON.parse(response.data.candidates[0].content.parts[0].text)));

      const messagesArray = JSON.parse(response.data.candidates[0].content.parts[0].text)

      if (Array.isArray(messagesArray)) {
        setMessagesFromAI(messagesArray);
      } else {
        console.error('Parsed response is not an array:', messagesArray);
      }
    }
    catch (error) {
      console.log(error)
      tooManyReq()
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
          <button disabled={wait} onClick={handleSubmit} className="w-24  bg-gray-300 text-black p-3 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-black">

            {
              wait ? "Please Wait" : "Send It"
            }
          </button>
        </div>
      </section>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={true}
      />

      <section className="mb-8">
        <button onClick={() => handleSugguestMessages()} className="bg-gray-300 text-black p-3 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-black mb-4">
          Suggest Messages
        </button>
        <h2 className="text-xl font-semibold mb-4">Click on any message below to select it.</h2>
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Messages</h3>
          <div className="space-y-2">
            {messagesFromAI.map((msg, index) => (
              <span onClick={() => setMessage(msg)} key={index} className="block p-3 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer">
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