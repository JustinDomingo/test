import "./App.css"
import { React, useReducer } from "react"
import Header from "./Header"
import Register from "./Register"
import Login from "./Login"
import Homepage from "./Homepage"
import Profile from "./Profile"
import DispatchContext from "./DispatchContext"
import StateContext from "./StateContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Cookies from "js-cookie"

function App() {
  const initState = {
    loggedIn: Boolean(Cookies.get("jwt")),
    userData: JSON.parse(window.localStorage.getItem("user")),
  }

  function ourReducer(state, action) {
    switch (action.type) {
      case "login":
        return { loggedIn: true, userData: action.value }
      case "logout":
        return { loggedIn: false, userData: action.value }
      default:
        return
    }
  }

  const [state, dispatch] = useReducer(ourReducer, initState)

  return (
    <DispatchContext.Provider value={{ dispatch }}>
      <StateContext.Provider value={{ state }}>
        <Router>
          <Header />
          <Switch>
            <Route exact path="/">
              {state.loggedIn ? <Homepage /> : <Register />}
            </Route>
            <Route path="/log-in">
              <Login />
            </Route>
            <Route path={`/user/:username`}>
              <Profile />
            </Route>
          </Switch>
        </Router>
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export default App
