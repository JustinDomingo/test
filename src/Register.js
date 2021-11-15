import React, { useState, useEffect, useRef, useContext } from "react"
import DispatchContext from "./DispatchContext"
import { Link } from "react-router-dom"
import Errors from "./Errors"
import "./Register.css"

function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [data, setData] = useState("")
  const [areErrors, setAreErrors] = useState()
  const [errors, setErrors] = useState("")
  const { dispatch } = useContext(DispatchContext)

  const firstUpdate = useRef(true)

  useEffect(() => {
    setAreErrors(true)
  }, [errors])

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    fetch("http://localhost:5000/api/react-register", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        if (!response.ok) {
          setErrors(response.err)
          setUsername("")
          setEmail("")
          setPassword("")
          console.log(response.err)
        } else {
          console.log(response.user)
          window.localStorage.setItem("user", JSON.stringify(response.user))
          dispatch({ type: "login", value: response.user })
        }
      })
      .catch((errs) => {
        //console.log(errs)
      })
  }, [data, dispatch])

  function submit(e) {
    e.preventDefault()
    setData({
      username: username,
      email: email,
      password: password,
    })
  }

  return (
    <>
      <center>
        <div className="register-container">
          <div className="register-title">
            <strong>SIGN UP, IT'S FREE!</strong>
          </div>
          <div className="input-container">
            <center>
              <form onSubmit={(e) => submit(e)} action="/register" method="POST">
                <div className="info">
                  <strong>Username</strong>
                </div>

                {areErrors ? <Errors errors={errors[0]} /> : console.log()}

                <input autoComplete="off" onChange={(e) => setUsername(e.target.value)} value={username} type="text" placeholder="Enter unique username..." className="register-input" name="username"></input>
                <div className="info">
                  <strong>Email</strong>
                </div>

                {areErrors ? <Errors errors={errors[1]} /> : console.log()}

                <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder="Enter unique email..." className="register-input" name="email"></input>
                <div className="info">
                  <strong>Password</strong>
                </div>

                {areErrors ? <Errors errors={errors[2]} /> : console.log()}

                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Enter unique password..." className="register-input" name="password"></input>
                <br></br>
                <button className="register-btn">Register</button>
              </form>
            </center>
          </div>
        </div>
      </center>
      <center>
        <br></br>
        <div className="already">
          Already have an account? <Link to="/log-in">Log in.</Link>
        </div>
      </center>
    </>
  )
}

export default Register
