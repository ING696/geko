import React from 'react'
import './Button.css'

const Button = ({variant}) => {
  return (
    <button className={`btn ${variant}`}>Button</button>
  )
}

export default Button