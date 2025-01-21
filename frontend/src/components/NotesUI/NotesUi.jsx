import React, { useEffect, useState } from 'react'
import NotesModal from '../Modal/NotesModal'

export default function NotesUi({ userNotes }) {
    const [isNotesModalOpen, setIsNotesModalOpen] = React.useState(false)
    const [modalData , setModalData] = useState('')


    useEffect(() => {
        console.log("userNotes", userNotes.messages.length)
    }, [])

    const handleNotesModalClick = (note) => {
        const fmsg = userNotes.messages.filter((message) => message.messageId == note)
        setModalData(fmsg)
        setIsNotesModalOpen(true)
    }
    const setIsNotesModalClose = () => {
        setIsNotesModalOpen(false)
    }
    return (
        <>

            {
                userNotes.messages.map((note) => (
                    <div className='w-[75px] h-[70px]'>
                        <div onClick={()=>handleNotesModalClick(note.messageId)} className='hover:cursor-pointer bg-slate-300 h-[100%] rounded-full flex justify-center items-center'>
                            {note.contentType}
                        </div>
                    </div>

                ))
            }
            <NotesModal
                isModalOpen={isNotesModalOpen}
                onModalClose={setIsNotesModalClose}
                modalData= {modalData}
                userName = {userNotes.userName}
            />



        </>
    )
}
