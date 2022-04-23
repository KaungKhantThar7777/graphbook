import React, { useState } from "react";
import { Helmet } from "react-helmet";
import "../../assets/css/style.css";

const initialPosts = [
  {
    id: 2,
    text: "Lorem ipsum",
    user: {
      avatar:
        "https://www.codigo.co/_next/image?url=https%3A%2F%2Fcdn.codigo.co%2Fuploads%2F2022%2F04%2FNaing-Mahar.png&w=3840&q=85",
      username: "Test User",
    },
  },
  {
    id: 1,
    text: "Lorem ipsum",
    user: {
      avatar:
        "https://www.codigo.co/_next/image?url=https%3A%2F%2Fcdn.codigo.co%2Fuploads%2F2022%2F04%2FMin-Khant-Kyaw.png&w=3840&q=85",
      username: "Test User 2",
    },
  },
];

const App = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [postContent, setPostContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setPosts((prev) => [
      ...prev,
      {
        id: posts.length,
        text: postContent,
        user: {
          avatar:
            "https://www.codigo.co/_next/image?url=https%3A%2F%2Fcdn.codigo.co%2Fuploads%2F2022%2F04%2FNaing-Mahar.png&w=3840&q=85",
          username: "Test User",
        },
      },
    ]);
    setPostContent("");
  };
  return (
    <div className="container">
      <Helmet>
        <title>Graphbook - Feed</title>
        <meta
          name="description"
          content="Newsfeed of all
your friends on Graphbook"
        />
      </Helmet>
      <div className="postForm">
        <form onSubmit={handleSubmit}>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Write your custom post!"
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
      <div className="feed">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <div className="header">
              <img src={post.user.avatar} />
              <h2>{post.user.username}</h2>
            </div>
            <p className="content">{post.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
