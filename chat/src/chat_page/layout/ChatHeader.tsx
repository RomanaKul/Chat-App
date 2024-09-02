import style from "./Layout.module.css";
import { useContext } from "react";
import { UserContext } from "../../user/UserContext";
import { Avatar } from "../components/Avatar";

interface ChatHeaderProps {
  selectedUserId: string | null;
}

export default function ChatHeader({ selectedUserId }: ChatHeaderProps) {
  const { username } = useContext(UserContext);

  return (
    <div className={style.hf_container}>
      {selectedUserId ? (
        <>
          <Avatar username={username || "Guest"} />
          <p className={style.username}>{username || "Guest"}</p>
        </>
      ) : null}
    </div>
  );
}
