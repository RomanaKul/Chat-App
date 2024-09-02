import { useContext, useEffect } from "react";
import style from "./Layout.module.css";
import Contacts from "../components/Contacts";
import { UserContext } from "../../user/UserContext";
import { Message } from "../../chat_page/ChatPage";
import { SelectedUser } from "../../chat_page/ChatPage";
import { Person } from "../../chat_page/ChatPage";

interface ContactsBoxProps {
  selectedUser?: SelectedUser;
  setSelectedUser: React.Dispatch<
    React.SetStateAction<SelectedUser | undefined>
  >;
  setWs: React.Dispatch<React.SetStateAction<WebSocket | null>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onlinePeople: { [key: string]: string };
  offlinePeople: Record<string, Person>;
  setOnlinePeople: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
}

export default function ContactsBox({
  selectedUser,
  setSelectedUser,
  setWs,
  setMessages,
  onlinePeople,
  setOnlinePeople,
  offlinePeople,
}: ContactsBoxProps) {
  const { id } = useContext(UserContext);

  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs() {
    const ws = new WebSocket("ws://localhost:3000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () =>
      setTimeout(() => {
        console.log("Reconnecting...");
        connectToWs();
      }, 1000)
    );
  }
  function showOnlinePeople(peopleArr: { userId: string; username: string }[]) {
    const people: { [key: string]: string } = {};
    peopleArr.forEach(
      ({ userId, username }: { userId: string; username: string }) => {
        people[userId] = username;
      }
    );
    setOnlinePeople(people);
  }
  function handleMessage(e: MessageEvent) {
    const messageData = JSON.parse(e.data);
    console.log(e, messageData);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  const onlinePplExclLogUser = { ...onlinePeople };
  delete onlinePplExclLogUser[id || ""];

  return (
    <div>
      <h2 className={style.contacts_header}>Chats</h2>
      <div className={style.contacts_container}>
        {Object.keys(onlinePplExclLogUser).map((userId) => (
          <Contacts
            key={userId}
            id={userId}
            username={onlinePplExclLogUser[userId]}
            selected={userId === selectedUser?.id}
            online={true}
            onClick={() =>
              setSelectedUser({
                id: userId,
                username: onlinePplExclLogUser[userId],
              })
            }
          />
        ))}

        {Object.keys(offlinePeople).map((userId) => (
          <Contacts
            key={userId}
            id={userId}
            username={offlinePeople[userId].username}
            selected={userId === selectedUser?.id}
            online={false}
            onClick={() =>
              setSelectedUser({
                id: userId,
                username: offlinePeople[userId].username,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
