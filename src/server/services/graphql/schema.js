const typeDefinitions = `
    type Post{
        id: Int
        text: String
        user:User
    }

    type User{
        id: Int
        avatar: String
        username: String
    }

    type Message{
        id: Int
        text: String
        user: User
        chat: Chat
    }

    type Chat{
        id: Int
        messages: [Message]
        users: [User]
        lastMessage: Message
    }
    type PostFeed{
        posts:[Post]
    }

    type UsersSearch{
        users:[User]
    }
    type RootQuery{
        posts:[Post]
        postsFeed(page: Int, limit: Int):PostFeed
        chats:[Chat]
        chat(chatId: Int):Chat
        usersSearch(page: Int, limit: Int, text:String!):UsersSearch
    }


    input PostInput{
        text: String!
    }
    input UserInput{
        username: String!
        avatar: String!
    }
    input ChatInput{
        users:[Int]
    }

    input MessageInput{
        text: String!
        chatId: Int!
    }
    type DeleteResponse{
        success: Boolean
    }
    type RootMutation{
        addPost(
            post:PostInput!
           
        ):Post
        addChat(chat:ChatInput!):Chat
        addMessage(message: MessageInput!):Message
        deletePost(postId: Int!):DeleteResponse
    }

    schema {
        query:RootQuery
        mutation: RootMutation
    }
`;

export default [typeDefinitions];
