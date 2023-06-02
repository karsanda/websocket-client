import { useState, useRef } from 'react'
import Socketto from 'socketto'

function useWebSocket(url, options) {
  let ws = useRef(new Socketto(url,options))
  return ws.current
}

function App() {
  const [value, setValue] = useState('')
  const [output, setOutput] = useState([])

  const ws = useWebSocket('ws://localhost:8080/connect', {
    onOpen: () => printOutput('OPEN'),
    onReconnect: () => printOutput('RECONNECT'),
    onMessage: (e) => printOutput(`RESPONSE: ${e.data}`),
    onRetry: () => { printOutput('RETRY TO CONNECT') },
    onFailed: () => { printOutput('FAILED TO CONNECT') }
  })

  function handleChange(e) {
    setValue(e.target.value)
  }

  function printOutput(message) {
    return setOutput((oldOutput) => [...oldOutput, message])
  }

  function open() {
    ws.createConnection()
  }

  function close() {
    if (ws) {
      printOutput(`CLOSE CONNECTION`)
      ws.closeConnection()
    } else {
      printOutput(`NO CONNECTION`)
    }
  }

  function send() {
    printOutput(`SEND: ${value}`)
    ws.send(value)
  }

  return (
    <>
      <div>
        <h3>WebSocket Client</h3>
        <p>
          Click "Open" to create a connection to the server,
          "Send" to send a message to the server and "Close" to close the connection.
          You can change the message and send multiple times.
        </p>
        <div>
          <button id="open" onClick={open}>Open</button>
          <button id="close" onClick={close}>Close</button>
        </div>
        <input id="input" type="text" placeholder="Hello world!" onChange={handleChange} />
        <button id="send" onClick={send}>Send</button>
      </div>
      <div id="output" style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
        {output.map(element => <p key={Math.random()}>{element}</p>)}
      </div>
    </>
  )
}

export default App
