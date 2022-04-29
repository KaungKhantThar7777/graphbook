import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDeletePostMutation } from "../../apollo/mutations/deletePost";
import Dropdown from "../helpers/dropdown";

export default ({ post }) => {
  const [deletePost] = useDeletePostMutation(post.id);
  return (
    <div className="header">
      <img src={post.user.avatar} />
      <div>
        <h2>{post.user.username}</h2>
      </div>
      <Dropdown trigger={<FontAwesomeIcon icon="angle-down" />}>
        <button
          onClick={() =>
            deletePost({
              variables: {
                postId: post.id,
              },
            })
          }
        >
          Delete Post
        </button>
      </Dropdown>
    </div>
  );
};
