import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div>
          <h1>GitHub Clone</h1>
          <p>Welcome to the application</p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank" rel="noreferrer">
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noreferrer">
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <h2>Connect with us</h2>
          <p>Join the community</p>
          <ul>
            <li>
              <a href="https://github.com/" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://discord.com/" target="_blank" rel="noreferrer">
                Discord
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
