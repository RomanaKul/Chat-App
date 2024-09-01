import { BiSolidSend } from "react-icons/bi";
import style from "./Layout.module.css";
import IconButton from "../components/IconButton";
import StyledInput from "../components/StyledInput";

export default function ChatFooter() {
  return (
    <div className={style.hf_container}>
      <StyledInput text="Type your message..." />
      <IconButton icon={<BiSolidSend />} />
    </div>
  );
}
