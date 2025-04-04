import React from 'react'
import { BsFillTrashFill } from 'react-icons/bs'

function SemesterButton({ onClick, active, id, handleDeleteSemester }) {
  return (
    <div className={`rounded-full border ${active ? "bg-[#00cc66] text-white" : "border-[#00cc66]"} p-2 px-4 flex`}>
      <button className='mr-4' type='button'  onClick={onClick}>Semester {id + 1}</button>

      <button className='align-middle' type='button' onClick={handleDeleteSemester}><BsFillTrashFill /></button>
    </div>
  )
}

export default SemesterButton