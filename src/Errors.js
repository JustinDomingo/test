import React from "react"
import "./index.css"

export default function Errors(props) {
  return <h3 className="flash-message">{props.errors}</h3>
}
