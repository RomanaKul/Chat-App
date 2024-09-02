import style from "./ChatPage.module.css";
import ContactsBox from "./layout/ContactsBox";
import ProfileHeader from "./layout/ProfileHeader";
import ChatBox from "./layout/ChatBox";
import { useState } from "react";

export interface Message {
  text?: string;
  sender?: string;
  recipient?: string;
  _id?: string;
}

export interface SelectedUser {
  username: string;
  id: string;
}

export interface Person {
  _id: string;
  username: string;
}

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState<SelectedUser>();
  const [newMessage, setNewMessage] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlinePeople, setOnlinePeople] = useState<{ [key: string]: string }>(
    {}
  );
  const [offlinePeople, setOfflinePeople] = useState<Record<string, Person>>(
    {}
  );

  return (
    <div className={style.chatContainer}>
      <div className={style.leftContainer}>
        <ProfileHeader />
        <ContactsBox
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setWs={setWs}
          setMessages={setMessages}
          onlinePeople={onlinePeople}
          setOnlinePeople={setOnlinePeople}
          offlinePeople={offlinePeople}
        />
      </div>
      <div className={style.rightContainer}>
        <ChatBox
          selectedUser={selectedUser}
          messages={messages}
          ws={ws}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          setMessages={setMessages}
          onlinePeople={onlinePeople}
          setOfflinePeople={setOfflinePeople}
        />
      </div>
    </div>
  );
}
