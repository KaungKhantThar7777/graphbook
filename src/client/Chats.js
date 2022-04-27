import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Chat from "./Chat";

const GET_CHATS = gql`
  query GetChats {
    chats {
      id
      users {
        id
        username
        avatar
      }
      lastMessage {
        text
      }
    }
  }
`;
const usernamesToString = (users) => {
  const userList = users.slice(1);
  var usernamesString = "";

  for (let i = 0; i < userList.length; i++) {
    usernamesString += userList[i].username;
    if (i - 1 === userList.length) {
      usernamesString += ", ";
    }
  }

  return usernamesString;
};

const short = (text) => {
  if (text.length > 12) {
    return text.substring(0, text.length - 9) + "...";
  }
  return text;
};

const Chats = () => {
  const [openChats, setOpenChats] = useState([]);

  const { data, loading, error } = useQuery(GET_CHATS);

  const openChat = (id) => {
    let chatsTemp = openChats.slice();
    console.log("calling ", id, chatsTemp.indexOf(id));

    if (chatsTemp.indexOf(id) == -1) {
      if (chatsTemp.length > 2) {
        chatsTemp = chatsTemp.slice(1);
      }
      chatsTemp.push(id);
      setOpenChats(chatsTemp);
    }
  };

  const closeChat = (id) => {
    let chatsTemp = openChats.slice();
    const index = chatsTemp.indexOf(id);
    chatsTemp.splice(index, 1);
    setOpenChats(chatsTemp);
  };

  if (loading)
    return (
      <div className="chats">
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="chats">
        <p>{error.message}</p>
      </div>
    );
  const { chats } = data;
  return (
    <div className="wrapper">
      <div className="chats">
        {chats.map((chat, i) => {
          return (
            <div
              key={chat.id}
              className="chat"
              onClick={() => openChat(chat.id)}
            >
              <div className="header">
                <img
                  src={
                    chat.users.length > 2
                      ? "/public/group.png"
                      : chat.users[1].avatar
                  }
                />
              </div>
              <div>
                <h2>{short(usernamesToString(chat.users))}</h2>
                <span>{chat.lastMessage.text}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="openChats">
        {openChats.map((chatId) => (
          <Chat chatId={chatId} key={chatId} closeChat={closeChat} />
        ))}
      </div>
    </div>
  );
};

export default Chats;
