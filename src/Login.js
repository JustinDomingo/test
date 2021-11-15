import { React, useState, useEffect, useRef, useContext } from "react"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import { useHistory } from "react-router-dom"
import Axios from "axios"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [data, setData] = useState("")
  const [areErrors, setAreErrors] = useState(false)
  const { state } = useContext(StateContext)
  const { dispatch } = useContext(DispatchContext)
  const history = useHistory()
  const firstRender = useRef(true)

  useEffect(() => {
    if (state.loggedIn) {
      history.push("/")
      return
    }
  }, [state.loggedIn, history])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    Axios.post("http://localhost:5000/api/react-login", data, { withCredentials: true })
      .then((res) => {
        dispatch({ type: "login", value: data })
        window.localStorage.setItem("user", JSON.stringify(data))
      })
      .catch(() => {
        setAreErrors(true)
        setUsername("")
        setPassword("")
      })
  }, [data])

  const handleSubmit = (e) => {
    e.preventDefault()
    setData({ username, password })
  }

  return (
    <div>
      <center>
        <div className="register-container">
          <div className="register-title">
            <strong>LOG IN</strong>
          </div>
          <div className="input-container">
            <form onSubmit={handleSubmit} action="/login" method="POST">
              {areErrors ? <h3 className="flash-message">Invalid Username/Password</h3> : console.log()}
              <div>
                <div className="info">
                  <strong>Username</strong>
                </div>
                <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" placeholder="Enter your username..." className="register-input" name="username"></input>
              </div>
              <div>
                <div className="info">
                  <strong>Password</strong>
                </div>
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Enter your password..." className="register-input" name="password"></input>
              </div>
              <br></br>
              <button className="register-btn">Log In!</button>
            </form>
          </div>
        </div>
      </center>
    </div>
  )
}
