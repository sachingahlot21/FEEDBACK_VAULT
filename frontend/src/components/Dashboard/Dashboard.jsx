import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import DeleteModal from '../Modal/DeleteModal';
import axios from 'axios';

const Dashboard = ({ handleLogout }) => {

  const [acceptMessages, setAcceptMessages] = useState(false);
  const [allMessages, setAllMessages] = useState([])
  const { logout } = useAuth()
  const { userNameContext, userIDContext } = useUser()


  const handleCopy = () => {
    navigator.clipboard.writeText(`http://localhost:5173/public/${userNameContext}`)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  const handleRefresh = () => {
    handleGetMessages()
  }

  const handleToggle = async () => {
    const data = {
      "messageStatus": !acceptMessages,
      "userId": userIDContext
    }

    try {
      const response = await axios.post('http://localhost:3000/accept-message', data)
      if (response.status > 200) {
        console.log('request fulfilled...')
        setAcceptMessages(prevState => !prevState);
      }
      else {
        console.log("failed to fulfill...")
      }
    }
    catch (error) {
      console.log("message request failed by error", error)
    }
  }

  const handleGetMessages = async () => {

    const data = {
      userid: userIDContext
    }
    try {

      const response = await axios.post("http://localhost:3000/messages", data)

      if (response.status === 200) {
        if (response.data.messages) {
          setAllMessages(response.data.messages);
        } else {
          console.error('No messages found in response data.');
          setAllMessages([]);
        }
      } else if (response.status === 402) {
        setAllMessages([]);
      } else {
        console.error(`Unexpected status code: ${response.status}`);
        setAllMessages([]);
      }
    }
    catch (error) {
      console.log("error fetching messages...", error.response.status)
      if (error.response.status === 402) {
        setAllMessages([])
      }
    }

  }

  const getAcceptMessage = async () => {
    const data = {
      userId: userIDContext
    }

    try {
      const response = await axios.post('http://localhost:3000/get-accept-message', data)
      if (response.status >= 200) {
        setAcceptMessages(response.data.messageAcceptStatus)
      }
      else {
        console.log("failed to fulfill...")
      }
    }
    catch (error) {
      console.log("message request failed by error", error)
    }
  }

  const handleDelete = async (id) => {
    console.log(id)
    try {
      const response = await axios.delete(`http://localhost:3000/${userIDContext}/delete_message/${id}`)
      if (response.status === 200) {
        handleGetMessages()
      }
    }
    catch (error) {
      console.log("delete message error...", error)
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageId , setMessageId] = useState()

  const openModal = (id) => {
    setIsModalOpen(true)
    setMessageId(id)
   
  };
  const closeModal = () => setIsModalOpen(false);

  const handleConfirm = () => {
    handleDelete(messageId)
    closeModal();
  };

  useEffect(() => {
    handleGetMessages()
    getAcceptMessage()
  }, [])



  return (
    <div className="w-full min-h-screen">

      <nav className='px-8 w-full text-white flex justify-between items-center bg-black  h-28 '>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <a href="#" className='text-3xl font-bold'>Feedback Vault</a>
          <span className="mr-4 text-2xl">Welcome, {userNameContext}</span>
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
              value={`http://localhost:5173/public/${userNameContext}`}
            />
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-primary/90 h-10 px-4 py-2"
              onClick={handleCopy}
            >
              Copy
            </button>
          </div>
        </div>
        <div className="flex items-center mb-4">
          <button
            type="button"
            role="switch"
            aria-checked={acceptMessages}
            onClick={handleToggle}
            className={`relative inline-flex items-center h-8 w-14 cursor-pointer rounded-full transition-colors ${acceptMessages ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <span
              className={`absolute left-1 top-1 block h-6 w-6 bg-white rounded-full shadow-md transform transition-transform ${acceptMessages ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
          <span className="ml-4 text-lg font-medium text-gray-700">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </span>
        </div>
        <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full"></div>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-transparent bg-gray-100 hover:bg-gray-200 hover:text-gray-900 h-10 px-4 py-2 mt-4"
          onClick={() => handleRefresh()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
            <path d="M16 16h5v5"></path>
          </svg>
        </button>

        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-lg">
          <div className="flex flex-col gap-4">
            {
              allMessages.length < 1 ?
                "No message to display..." :

                allMessages.map((msg, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-800">{msg.content}</p>
                    <button
                      onClick={() => openModal(msg._id)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                ))

            }
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default Dashboard;
