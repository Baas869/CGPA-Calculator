import React from 'react'

function Inputs({ type, placeholder, id, options, onChange }) {
    
  return (
    <input onChange={onChange} type={type} placeholder={placeholder} id={id} className={`input ${options}`} />
    
  )
}

export default Inputs