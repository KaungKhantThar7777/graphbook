import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQuery, gql, useMutation } from "@apollo/client";
import Loading from "./components/loading";
import Error from "./components/error";
import Post from "./components/post";
import { GET_POSTS } from "./apollo/queries/getPosts";
import {
  ADD_POST,
  getAddPostConfig,
  useAddPostMutation,
} from "./apollo/mutations/addPost";
import FeedList from "./components/post/feedlist";

const Feed = () => {
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { data, loading, error, fetchMore } = useQuery(GET_POSTS, {
    pollInterval: 5000,
    variables: {
      page: 0,
      limit: 10,
    },
  });
  const [postContent, setPostContent] = useState("");

  const [addPost] = useAddPostMutation(postContent);

  const handleSubmit = (e) => {
    e.preventDefault();

    addPost({ variables: { post: { text: postContent } } });
    setPostContent("");
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <Error>
        <h1>{error.message}</h1>
      </Error>
    );

  const { postsFeed } = data;
  const { posts } = postsFeed;

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
      <FeedList posts={posts} fetchMore={fetchMore} />
    </div>
  );
};

export default Feed;
