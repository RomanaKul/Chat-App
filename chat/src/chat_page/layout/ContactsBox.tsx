import { useEffect, useState } from "react";
import style from "./Layout.module.css";
import { Avatar } from "../components/Avatar";

export default function ContactsBox() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlinePeople, setOnlinePeople] = useState<{ [key: string]: string }>(
    {}
  );
  console.log("ws", ws);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

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
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    }
  }
  return (
    <div>
      <h2 className={style.contacts_header}>Chats</h2>
      <div className={style.contacts_container}>
        {Object.keys(onlinePeople).map((userId) => (
          <>
            {
              <div className={style.contact}>
                <Avatar username={onlinePeople[userId]} />
                <p>{onlinePeople[userId]}</p>
              </div>
            }
          </>
        ))}
      </div>
    </div>
  );
}
