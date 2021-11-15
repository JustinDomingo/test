import "./Header.css"
import { useContext, useState, useEffect, useRef } from "react"
import { Link, useHistory } from "react-router-dom"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import Cookies from "js-cookie"

function Header() {
  const { state } = useContext(StateContext)
  const { dispatch } = useContext(DispatchContext)
  const [invis, setInvis] = useState("invisible")
  const [active, setActive] = useState(false)
  const history = useHistory()

  const handleDropdown = (e) => {
    if (active) {
      setInvis("invisible")
      setActive(false)
    } else {
      setInvis("")
      setActive(true)
    }
  }

  const handleLogout = (e) => {
    Cookies.remove("jwt")
    localStorage.removeItem("user")
    setInvis("invisible")
    dispatch({ type: "logout" })
    history.push("/")
  }

  return (
    <>
      <h1 className="header-container">
        <strong>
          <Link to="/" className="title">
            MiniPost
          </Link>
          {state.loggedIn ? (
            <button className="logout" onClick={handleDropdown}>
              v
            </button>
          ) : (
            console.log()
          )}
        </strong>
      </h1>
      {state.loggedIn ? (
        <div className={`drop-cont ${invis}`}>
          <div className="test">
            <Link class="no-dec" to={`/user/${state.userData.username}`}>
              Profile
            </Link>
          </div>
          <div className="test">
            <button onClick={handleLogout} className="test-btn">
              Logout
            </button>
          </div>
        </div>
      ) : (
        console.log()
      )}
    </>
  )
}

export default Header
