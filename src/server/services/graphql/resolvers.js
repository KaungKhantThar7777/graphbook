import logger from "../../helpers/logger";

const posts = [
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

const resolvers = {
  RootQuery: {
    posts(root, args, context) {
      return posts;
    },
  },
  RootMutation: {
    addPost(root, { post, user }, context) {
      const postObject = {
        ...post,
        user,
        id: posts.length + 1,
      };
      logger.log({ level: "info", message: "Post added successfully" });
      posts.push(postObject);
      return postObject;
    },
  },
};

export default resolvers;
