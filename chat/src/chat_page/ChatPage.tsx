import style from "./ChatPage.module.css";
import ContactsBox from "./layout/ContactsBox";
import ProfileHeader from "./layout/ProfileHeader";
import ChatBox from "./layout/ChatBox";
import { useState } from "react";

export interface Message {
  text?: string;
  sender?: string;
  recipient?: string;
  id?: string;
}

export interface SelectedUser {
  username: string;
  id: string;
}

export default function ChatPage() {
  // const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<SelectedUser>();
  const [newMessage, setNewMessage] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className={style.chatContainer}>
      <div className={style.leftContainer}>
        <ProfileHeader />
        <ContactsBox
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setWs={setWs}
          setMessages={setMessages}
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
        />
      </div>
    </div>
  );
}
