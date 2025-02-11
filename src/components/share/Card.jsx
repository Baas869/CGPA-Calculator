import React from 'react'

function Card({ children, version}) {
  return (
    <div className='card'>
        {children}
    </div>
  )
}

export default Card