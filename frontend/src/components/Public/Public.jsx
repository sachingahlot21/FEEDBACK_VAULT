import React from 'react'
import { Link } from 'react-router-dom'

function Public() {
  return (
    <div>
      Public

        <Link to={'/dashboard'} >Signup</Link>
    </div>
  )
}

export default Public