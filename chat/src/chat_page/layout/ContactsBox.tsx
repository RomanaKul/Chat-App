import { useContext, useEffect, useState } from "react";
import style from "./Layout.module.css";
import { Avatar } from "../components/Avatar";
import { UserContext } from "../../user/UserContext";
import { Message } from "../../chat_page/ChatPage";
import { SelectedUser } from "../../chat_page/ChatPage";

interface ContactsBoxProps {
  selectedUser?: SelectedUser;
  setSelectedUser: React.Dispatch<
    React.SetStateAction<SelectedUser | undefined>
  >;
  setWs: React.Dispatch<React.SetStateAction<WebSocket | null>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ContactsBox({
  selectedUser,
  setSelectedUser,
  setWs,
  setMessages,
}: ContactsBoxProps) {
  const [onlinePeople, setOnlinePeople] = useState<{ [key: string]: string }>(
    {}
  );

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
          <div
            key={userId}
            onClick={() =>
              setSelectedUser({ username: onlinePeople[userId], id: userId })
            }
            className={`${style.contact} ${
              selectedUser?.id === userId ? style.selected_contact : ""
            }`}
          >
            <Avatar username={onlinePeople[userId]} />
            <p>{onlinePeople[userId]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
