import React from "react";
import FeedList from "../post/feedlist";
import UserHeader from "./header";
import Loading from "../loading";
import Error from "../error";
import { useGetPostsQuery } from "../../apollo/queries/getPosts";
import { useGetUserQuery } from "../../apollo/queries/getUser";

const UserProfile = ({ username }) => {
  const { data: userData, loading: userLoading } = useGetUserQuery({
    username,
  });
  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
    fetchMore,
  } = useGetPostsQuery({ username });

  if (userLoading || postsLoading) return <Loading />;
  if (postsError)
    return (
      <Error>
        <p>{postsError.message}</p>
      </Error>
    );
  return (
    <div className="user">
      <div className="inner">
        <UserHeader user={userData.user} />
      </div>
      <div className="container">
        <FeedList posts={postsData.postsFeed.posts} fetchMore={fetchMore} />
      </div>
    </div>
  );
};

export default UserProfile;
