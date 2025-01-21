import React, { useEffect } from 'react'

function NotesModal({ isModalOpen, onModalClose, modalData, userName }) {
    if (!isModalOpen) return null;
    useEffect(()=>{
console.log("modalData" ,modalData)
    },[])
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">

                <div className='flex items-center mb-2'>
                    <div className='w-[50px] h-[50px] mr-2'>
                        <div className='bg-red-400 w-full rounded-full h-[100%] flex justify-center items-center '>
                            img.
                        </div>
                    </div>
                    <div>
                        <div>
                            <h1 className='font-bold'>@{userName}</h1>
                        </div>
                        <div>
                            <h1 className='text-xs'>2hr ago</h1>
                        </div>
                    </div>
                </div>

                <div>
                    {
                        modalData[0].content
                    }
                </div>

                <div className='mt-2 w-full'>

                        <input className='border border-slate-600 h-[35px]  rounded-l-md px-2' type='text' placeholder='Reply' />
                        <button className='w-[60px] rounded-r-md h-[35px] bg-slate-500 text-white'>Send</button>
                    
                </div>

                
            </div>

            <button
                    onClick={onModalClose}
                    className="absolute top-[15px] right-[20px] px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    X
                </button>
        </div>
    )
}

export default NotesModal