import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import logger from "../../helpers/logger";

const { JWT_SECRET } = process.env;
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
      currentUser(root, args, context) {
        return context.user;
      },
      usersSearch(root, { page, limit, text }, context) {
        if (text.length < 3) {
          return {
            users: [],
          };
        }
        let skip = 0;

        if (page && limit) {
          skip = page * limit;
        }
        let query = {
          order: [["createdAt", "DESC"]],
          offset: skip,
        };

        if (limit) {
          query.limit = limit;
        }
        query.where = {
          username: {
            [Op.like]: `%${text}%`,
          },
        };
        return {
          users: User.findAll(query),
        };
      },
      postsFeed(root, { page, limit }, context) {
        let skip = 0;
        if (page && limit) {
          skip = page * limit;
        }

        let query = {
          order: [["createdAt", "DESC"]],
          offset: skip,
        };

        if (limit) {
          query.limit = limit;
        }

        return {
          posts: Post.findAll(query),
        };
      },
      posts(root, args, context) {
        return Post.findAll({ order: [["createdAt", "DESC"]] });
      },
      chats(root, args, context) {
        return Chat.findAll({
          include: [
            {
              model: User,
              required: true,
              through: { where: { userId: context.user.id } },
            },
            {
              model: Message,
            },
          ],
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
      signup(root, { email, username, password }, context) {
        return User.findAll({
          where: {
            [Op.or]: [{ email }, { username }],
          },
        }).then(async (users) => {
          if (users.length) {
            throw new Error("User already existed");
          } else {
            return bcrypt.hash(password, 10).then((salt) => {
              return User.create({
                email,
                password: salt,
                username,
                activated: 1,
              }).then((user) => {
                const token = JWT.sign(
                  {
                    email,
                    id: user.id,
                  },
                  JWT_SECRET,
                  {
                    expiresIn: "1d",
                  }
                );
                return { token };
              });
            });
          }
        });
      },
      login(root, { email, password }, context) {
        return User.findAll({
          where: {
            email,
          },
          raw: true,
        }).then(async (users) => {
          if (users.length === 1) {
            const user = users[0];
            const passwordValid = await bcrypt.compare(password, user.password);
            if (!passwordValid) {
              throw new Error("Invalid email/password");
            }
            const token = JWT.sign({ email, id: user.id }, JWT_SECRET, {
              expiresIn: "1d",
            });
            return { token };
          } else {
            throw new Error("Invalid email/password");
          }
        });
      },
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
        return Post.create({
          ...post,
        }).then((newPost) => {
          return Promise.all([newPost.setUser(context.user.id)]).then(() => {
            logger.log({
              level: "info",
              message: "Post was created",
            });
            return newPost;
          });
        });
      },
      addMessage(root, { message }, context) {
        return Message.create({
          ...message,
        }).then((newMessage) => {
          return Promise.all([
            newMessage.setUser(context.user.id),
            newMessage.setChat(message.chatId),
          ]).then(() => {
            logger.log({
              level: "info",
              message: "Message was created",
            });
            return newMessage;
          });
        });
      },
      deletePost(root, { postId }, context) {
        return Post.destroy({
          where: {
            id: postId,
          },
        }).then(
          (rows) => {
            if (rows === 1) {
              logger.log({
                level: "info",
                message: `Post ${postId} was deleted`,
              });
              return {
                success: true,
              };
            }
          },
          (error) => {
            logger.log({
              level: "error",
              message: error.message,
            });
          }
        );
      },
    },
  };
  return resolvers;
}
