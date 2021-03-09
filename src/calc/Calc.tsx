import React, { useState } from 'react'

// <Wrap>
//  <h1>Pozadí</h1>
// </Wrap>
const Wrap = ({ children }: { children: React.ReactNode }) => (
  <div style={{ backgroundColor: 'red' }}>{children}</div>
)

const Counter = () => {
  const [count, setCount] = useState(0)

  const increment = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>Increment</button>
    </div>
  )
}

// Calc je functional komponenta
const Calc = () => <Counter />

export default Calc
