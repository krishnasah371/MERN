import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [addedNewPost, setaddedNewPost] = useState(false);

  const handleTextArea = (e) => {
    setPost(e.target.value);
  };
  const handlePostButton = async (e) => {
    if (post) {
      const response = await fetch("http://127.0.0.1:8080/posts", {
        method: "POST",
        body: JSON.stringify({ content: post }),
        headers: { "content-Type": "application/json" },
      });
      console.log(response);

      const responseJson = await response.json();

      if (responseJson.status === 200) {
        setaddedNewPost(!addedNewPost);
      }
      setPost("");
    }
  };

  const handleDeleteButton = async (id) => {
    const response = await fetch(`http://localhost:8080/posts/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    // Update posts based upon the status code
    const responseJson = await response.json();
    if (responseJson.status === 200) {
      setaddedNewPost(!addedNewPost);
    }
  };

  const evaluateDateAndTime = (dateAndTime) => {
    const dateTime = new Date(dateAndTime).toUTCString();
    return dateTime;
  };

  useEffect(() => {
    const fetchApi = async () => {
      const response = await fetch("http://127.0.0.1:8080/posts");
      const allFields = await response.json();
      setPosts(allFields.data.reverse());
    };
    fetchApi();
  }, [addedNewPost]);
  return (
    <div className="react-app-component text-center">
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Enter your post</label>
                  <textarea
                    className="form-control"
                    placeholder="Say something..."
                    id="post-content"
                    rows="3"
                    value={post}
                    onChange={(e) => handleTextArea(e)}
                  ></textarea>
                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className="btn btn-primary mt-2"
                      onClick={() => handlePostButton()}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="body-cards">
              {posts.map((post) => {
                return (
                  <div className="card text-white bg-dark my-3 text-start added-card">
                    <div className="card-body">
                      <h6 className="card-subtitle mb-2 text-muted">
                        {evaluateDateAndTime(post.createdAt)}
                      </h6>
                      <p className="card-text">{post.content}</p>
                      <button
                        className="card-link"
                        onClick={() => handleDeleteButton(post._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
