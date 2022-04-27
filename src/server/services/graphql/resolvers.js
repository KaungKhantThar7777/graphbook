import logger from "../../helpers/logger";

export default function resolver() {
  const { db } = this;
  const { Post, User, Chat, Message } = db.models;
  const resolvers = {
    Message: {
      user(message, args, context) {
        return message.getUser();
      },
      chat(message, args, context) {
        return message.getChat();
      },
    },
    Chat: {
      lastMessage(chat, args, context) {
        return chat
          .getMessages({ limit: 1, order: [["id", "DESC"]] })
          .then((message) => message[0]);
      },
      messages(chat, args, context) {
        return chat.getMessages({ order: [["id", "asc"]] });
      },
      users(chat, args, context) {
        return chat.getUsers();
      },
    },
    Post: {
      user(post, args, context) {
        return post.getUser();
      },
    },
    RootQuery: {
      posts(root, args, context) {
        return Post.findAll({ order: [["createdAt", "DESC"]] });
      },
      chats(root, args, context) {
        return User.findAll().then((users) => {
          if (!users.length) {
            return [];
          }

          const usersRow = users[0];
          return Chat.findAll({
            include: [
              {
                model: User,
                required: true,
                through: { where: { userId: usersRow.id } },
              },
              {
                model: Message,
              },
            ],
          });
        });
      },
      chat(root, { chatId }, context) {
        return Chat.findByPk(chatId, {
          include: [
            {
              model: User,
              required: true,
            },
            {
              model: Message,
            },
          ],
        });
      },
    },
    RootMutation: {
      addChat(root, { chat }, context) {
        return Chat.create().then((newChat) => {
          return Promise.all([newChat.setUsers(chat.users)]).then(() => {
            logger.log({
              level: "info",
              message: "Chat was created",
            });
            return newChat;
          });
        });
      },
      addPost(root, { post }, context) {
        return User.findAll().then((users) => {
          const usersRow = users[0];

          return Post.create({
            ...post,
          }).then((newPost) => {
            return Promise.all([newPost.setUser(usersRow.id)]).then(() => {
              logger.log({
                level: "info",
                message: "Post was created",
              });
              return newPost;
            });
          });
        });
      },
      addMessage(root, { message }, context) {
        return User.findAll().then((users) => {
          const usersRow = users[0];

          return Message.create({
            ...message,
          }).then((newMessage) => {
            return Promise.all([
              newMessage.setUser(usersRow.id),
              newMessage.setChat(message.chatId),
            ]).then(() => {
              logger.log({
                level: "info",
                message: "Message was created",
              });
              return newMessage;
            });
          });
        });
      },
    },
  };
  return resolvers;
}
