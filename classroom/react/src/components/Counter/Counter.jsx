import React, { useState } from 'react'

const Counter = () => {

  const [count, setCount] = useState(0)
  const handleAddCount = () => {
    setCount(count + 1)
  }
  const handleDecreaseCount = () => {
    setCount(count - 1)
  }

  return (
    <div>
      <h1>Count: {count} </h1>
      <div>
        <button onClick={handleAddCount}>+</button>
        <button onClick={handleDecreaseCount}>-</button>
      </div>
    </div>
  )
}

export default Counter
