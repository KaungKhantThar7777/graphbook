const typeDefinitions = `
    directive @auth on QUERY | FIELD_DEFINITION | FIELD
    scalar Upload

    type File {
        filename: String!
        mimetype: String!
        encoding: String!
        url: String!
    }
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
        user(username: String!):User @auth
        currentUser: User @auth
        posts:[Post]
        postsFeed(page: Int, limit: Int,username: String):PostFeed @auth
        chats:[Chat] @auth
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
    type Auth{
        token: String
    }
    type RootMutation{
        uploadAvatar(
            file: Upload!
        ):File @auth
        addPost(
            post:PostInput!
           
        ):Post
        addChat(chat:ChatInput!):Chat
        addMessage(message: MessageInput!):Message
        deletePost(postId: Int!):DeleteResponse
        login(email: String!, password: String!):Auth
        signup(email: String!, username: String!, password:String!):Auth
    }

    schema {
        query:RootQuery
        mutation: RootMutation
    }
`;

export default [typeDefinitions];
