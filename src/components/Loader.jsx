import React from 'react'
import { Spinner } from 'react-bootstrap'
import './css/Loader.css'

const Loader = () => {
  return (
    <div className='full_screen'>
        <Spinner className='spinner' animation='grow' variant='primary'></Spinner>
    </div>
  )
}

export default Loader