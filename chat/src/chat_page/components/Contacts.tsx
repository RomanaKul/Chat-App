import style from "../layout/Layout.module.css";
import { Avatar } from "./Avatar";
import { SelectedUser } from "../../chat_page/ChatPage";

interface Contacts {
  id: string;
  username: string;
  selected: boolean;
  onClick: (user: SelectedUser) => void;
  online: boolean;
}

export default function Contacts({
  id,
  username,
  selected,
  onClick,
  online,
}: Contacts) {
  return (
    <div
      key={id}
      onClick={() => onClick({ id, username })}
      className={`${style.contact} ${selected ? style.selected_contact : ""}`}
    >
      <Avatar online={online} username={username} />
      <p>{username}</p>
    </div>
  );
}
