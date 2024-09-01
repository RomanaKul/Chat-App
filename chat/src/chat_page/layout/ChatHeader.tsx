import style from "./Layout.module.css";
import { useContext } from "react";
import { UserContext } from "../../user/UserContext";
import { Avatar } from "../components/Avatar";

export default function ChatHeader() {
  const { username } = useContext(UserContext);

  return (
    <div className={style.hf_container}>
      <Avatar username={username || "Guest"} />
      <p className={style.username}>{username}</p>
    </div>
  );
}
