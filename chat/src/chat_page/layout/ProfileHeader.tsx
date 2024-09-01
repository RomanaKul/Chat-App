import IconButton from "../components/IconButton";
import { IoLogOut } from "react-icons/io5";
import StyledInput from "../components/StyledInput";
import { useContext } from "react";
import { UserContext } from "../../user/UserContext";
import style from "./Layout.module.css";
import { Avatar } from "../components/Avatar";

export default function ProfileHeader() {
  const { username } = useContext(UserContext);
  return (
    <div className={style.profile_header_container}>
      <div className={style.hf_container}>
        <Avatar username={username || "Guest"} />
        <h2 className={style.username}>{username}</h2>
        <IconButton icon={<IoLogOut />} />
      </div>
      <div className={style.search}>
        <StyledInput text={"Search..."} />
      </div>
    </div>
  );
}
