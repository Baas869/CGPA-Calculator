import React from 'react'

function Options({ children, options }) {
  return (
    <select className={`input ${options}`} place>
        {children}
    </select>
  )
}

export default Options