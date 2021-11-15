import React, { useState, useEffect } from "react"
import Axios from "axios"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"

export default function Profile() {
  const [profileData, setProfileData] = useState({})
  const [userPosts, setUserPosts] = useState(null)
  const { username } = useParams()

  useEffect(() => {
    Axios.get(`http://localhost:5000/api/users/${username}`).then((res) => {
      Axios.get(`http://localhost:5000/api/posts/${username}`).then((res) => {
        let arr = res.data.sort((a, b) => {
          return new Date(b.date) - new Date(a.date)
        })
        setUserPosts(arr)
      })
      setProfileData(res.data)
    })
  }, [setProfileData, username])

  return (
    <div>
      <center>
        <div className="prof-container">
          <div>
            <h1 className="prof-username">@{profileData.username}</h1>
            {userPosts && userPosts.length ? (
              userPosts.map((item) => {
                return (
                  <div className="prof-post-container" key={item._id}>
                    <Link className="a" to={`/user/${item.author}`}>
                      <h3 className="prof-author">{item.author}</h3>
                    </Link>
                    <div className="prof-date">{item.date.toLocaleString()}</div>
                    <div className="body-container">
                      <p className="prof-body">{item.body}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="none">No posts yet...</div>
            )}
          </div>
        </div>
      </center>
    </div>
  )
}
