import { useQuery, gql, useMutation } from "@apollo/client";
import React, { useState } from "react";

const GET_POSTS = gql`
  query {
    posts {
      id
      text
      user {
        avatar
        username
      }
    }
  }
`;

const ADD_POST = gql`
  mutation addPost($post: PostInput!) {
    addPost(post: $post) {
      id
      text
      user {
        avatar
        username
      }
    }
  }
`;

const Feed = () => {
  const { data, loading, error } = useQuery(GET_POSTS, {
    pollInterval: 5000,
  });
  const [postContent, setPostContent] = useState("");

  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      cache.modify({
        fields: {
          posts(existingPosts = []) {
            const newPostRef = cache.writeFragment({
              data: addPost,
              fragment: gql`
                fragment NewPost on Post {
                  id
                  type
                }
              `,
            });

            return [newPostRef, ...existingPosts];
          },
        },
      });
    },
    optimisticResponse: {
      __typename: "mutation",
      addPost: {
        __typename: "Post",
        text: postContent,
        id: -1,
        user: {
          __typename: "User",
          username: "Loading...",
          avatar: "/public/loading.gif",
        },
      },
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    addPost({ variables: { post: { text: postContent } } });
    setPostContent("");
  };

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>{error.message}</h1>;

  const { posts } = data;

  return (
    <div className="container">
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
          <div
            key={post.id}
            className={"post" + (post.id < 0 ? "optimistic" : "")}
          >
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

export default Feed;
