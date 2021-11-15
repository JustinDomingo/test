import "./Homepage.css"
import React, { useState, useEffect, useRef, useContext } from "react"
import { Link } from "react-router-dom"
import StateContext from "./StateContext"
import axios from "axios"

export default function Item(props) {
  const [active, setActive] = useState(false)
  const [evt, setEvt] = useState("")
  const [inEdit, setInEdit] = useState(false)
  const [updatedText, setUpdatedText] = useState("")
  const { state } = useContext(StateContext)
  const firstRenderOne = useRef(true)
  const firstRenderTwo = useRef(true)
  let toggled

  useEffect(() => {
    if (firstRenderOne.current) {
      firstRenderOne.current = false
      return
    }
    setActive(true)
  }, [evt])

  useEffect(() => {
    if (firstRenderTwo.current) {
      firstRenderTwo.current = false
      return
    }
    toggled = true
    if (toggled) {
      let btns = evt.target.parentElement.children
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove("invisible")
      }
    }
    if (!toggled) {
      let btns = evt.target.parentElement.children
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.add("invisible")
      }
      toggled = false
    }
  }, [active])

  const handleClick = (e) => {
    setEvt(e)
  }

  const handleEdit = (e) => {
    let author = e.target.getAttribute("data-author")
    axios
      .post("http://localhost:5000/api/verify", { author }, { withCredentials: true })
      .then((res) => {
        if (res.data.ok) {
          setInEdit(true)
        }
      })
      .catch(() => {
        props.setCss("error-msg")
        props.setFlash("You can only edit your own posts")
      })
  }

  const handleDelete = (e) => {
    let author = e.target.getAttribute("data-author")
    let _id = e.target.getAttribute("data-id")
    axios
      .post("http://localhost:5000/api/delete-post", { author, _id }, { withCredentials: true })
      .then((res) => {
        console.log(res.data)
        props.setCss("success-msg")
        props.setFlash(res.data.message)
        props.setData(res.data.updatedCollection)
        setInEdit(false)
      })
      .catch(() => {
        props.setCss("error-msg")
        props.setFlash("You can only delete your own posts")
      })
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    let _id = e.target.getAttribute("data-id")
    axios.post("http://localhost:5000/api/edit-post", { updatedText, _id }, { withCredentials: true }).then((res) => {
      setInEdit(false)
      props.setData(res.data.posts)
    })
  }

  const handleEditCancel = () => {
    setInEdit(false)
  }

  return (
    <div className="post-container" key={props.item._id}>
      <Link className="a" to={`/user/${props.item.author}`}>
        <h3 className="author">{props.item.author}</h3>
      </Link>
      <div className="date">{props.item.date.toLocaleString()}</div>
      <div>
        <button onClick={handleClick} id="optionsBtn" className="options-btn">
          <i className="fas fa-ellipsis-v el-gray"></i>
        </button>
        <button onClick={handleEdit} data-author={`${props.item.author}`} data-id={`${props.item._id}`} data-text={`${props.item.body}`} id="editBtn" className="edit inside-btn invisible">
          Edit
        </button>
        <button onClick={handleDelete} data-author={`${props.item.author}`} data-id={`${props.item._id}`} id="deleteBtn" className="delete inside-btn invisible">
          Delete
        </button>
        <br></br>
      </div>
      {inEdit ? (
        <form onSubmit={handleEditSubmit} data-id={`${props.item._id}`}>
          <input
            onChange={(e) => {
              setUpdatedText(e.target.value)
            }}
            id="editInput"
            placeholder={`${props.item.body}`}
            className="edit-input"
          ></input>
          <button className="upd-btn">Post</button>
          <button onClick={handleEditCancel} className="upd-btn" type="button">
            Cancel
          </button>
        </form>
      ) : (
        <p className="body-text">{props.item.body}</p>
      )}
    </div>
  )
}
