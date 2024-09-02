import IconButton from "../components/IconButton";
import { IoLogOut } from "react-icons/io5";
import StyledInput from "../components/StyledInput";
import { useContext } from "react";
import { UserContext } from "../../user/UserContext";
import style from "./Layout.module.css";
import { Avatar } from "../components/Avatar";
import axios from "axios";

export default function ProfileHeader() {
  const { username, setId, setUsername } = useContext(UserContext);

  function handleLogout() {
    axios.post("/logout").then(() => {
      setId(null);
      setUsername(null);
    });
  }

  return (
    <div className={style.profile_header_container}>
      <div className={style.hf_container}>
        <Avatar online={true} username={username || "Guest"} />
        <h2 className={style.username}>{username}</h2>
        <IconButton onClick={handleLogout} icon={<IoLogOut />} />
      </div>
      <div className={style.search}>
        <StyledInput placeholder={"Search..."} />
      </div>
    </div>
  );
}
