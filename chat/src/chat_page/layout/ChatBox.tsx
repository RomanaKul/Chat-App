import style from "./Layout.module.css";
import { Message } from "../../chat_page/ChatPage";
import { uniqBy } from "lodash";
import { UserContext } from "../../user/UserContext";
import { useContext, useEffect, useRef } from "react";
import { BiSolidSend } from "react-icons/bi";
import IconButton from "../components/IconButton";
import StyledInput from "../components/StyledInput";
import { Avatar } from "../components/Avatar";
import { SelectedUser } from "../../chat_page/ChatPage";
import axios from "axios";

interface ChatBoxProps {
  selectedUser?: SelectedUser;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  ws: WebSocket | null;
}

export default function ChatBox({
  selectedUser,
  messages,
  newMessage,
  setNewMessage,
  ws,
  setMessages,
}: ChatBoxProps) {
  const { id } = useContext(UserContext);
  const autoScrollRef = useRef<HTMLDivElement>(null);
  const messagesWithoutDupes = uniqBy(messages, "_id");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (ws) {
      ws.send(
        JSON.stringify({
          recipient: selectedUser?.id,
          text: newMessage,
        })
      );
    } else {
      console.error("WebSocket is not connected");
    }
    setNewMessage("");
    setMessages((prev) => [
      ...prev,
      {
        text: newMessage,
        sender: id || "",
        recipient: selectedUser?.id || "",
        _id: Date.now().toString(),
      },
    ]);
  }

  useEffect(() => {
    if (autoScrollRef.current) {
      autoScrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      axios.get("/messages/" + selectedUser?.id).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUser]);

  return (
    <>
      <div className={style.hf_container}>
        {selectedUser ? (
          <>
            <Avatar username={selectedUser?.username || "Guest"} />
            <p className={style.username}>
              {selectedUser?.username || "Guest"}
            </p>
          </>
        ) : null}
      </div>
      <div className={style.chat_box_container}>
        {!selectedUser && (
          <div className={style.select_user_message}>
            <h2>Select a contact to start a chat</h2>
          </div>
        )}
        {!!selectedUser && (
          <div>
            {messagesWithoutDupes.map((message: Message) => (
              <div
                key={message._id}
                className={`${style.message} ${
                  message.sender === id
                    ? style.my_message
                    : style.message_from_contact
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
        )}
        <div ref={autoScrollRef} />
      </div>

      <form className={style.hf_container} onSubmit={handleSubmit}>
        {selectedUser && (
          <>
            <StyledInput
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <IconButton type="submit" icon={<BiSolidSend />} />
          </>
        )}
      </form>
    </>
  );
}
