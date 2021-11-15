import "./Homepage.css"
import React, { useState, useEffect, useRef, useContext } from "react"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faArrowDown } from "@fortawesome/free-solid-svg-icons"
import Item from "./Item"
import StateContext from "./StateContext"
import Axios from "axios"

export default function Homepage() {
  const [body, setBody] = useState("")
  const [sortedData, setSortedData] = useState("")
  const [data, setData] = useState("")
  const [css, setCss] = useState("")
  const [flash, setFlash] = useState(null)
  const { state } = useContext(StateContext)
  const firstRender = useRef(true)

  useEffect(() => {
    Axios.get("http://localhost:5000/api/data").then((res) => {
      setData(res.data)
    })
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    data.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date)
    })
    setSortedData(data)
  }, [data])

  useEffect(() => {
    console.log(sortedData)
  }, [sortedData])

  const handleSubmit = (e) => {
    e.preventDefault()
    Axios.post("http://localhost:5000/api/react-create-post", { text: body }, { withCredentials: true })
      .then((res) => {
        setData(res.data.posts)
        setFlash("Successfully created post.")
        setCss("success-msg")
        setBody("")
      })
      .catch((err) => {
        setCss("error-msg")
        setFlash("Field cannot be left blank.")
      })
  }

  return (
    <div>
      <center>
        <div className="create-container">
          <div className="posts-title">Create Post</div>
          <form id="theForm" onSubmit={(e) => handleSubmit(e)}>
            <textarea onChange={(e) => setBody(e.target.value)} value={`${body}`} id="theInput" className="post-input" name="text" type="text"></textarea>
            <button className="submit-btn">POST</button>
          </form>
        </div>
        <div id="postsContainer" className="posts-container">
          <div className="posts-title">Latest Posts</div>
          {flash ? <div className={css}>{flash}</div> : console.log()}
          <div id="postInput">
            {sortedData &&
              sortedData.map((item) => {
                return <Item setFlash={setFlash} setCss={setCss} item={item} setData={setData} />
              })}
          </div>
        </div>
      </center>
    </div>
  )
}
