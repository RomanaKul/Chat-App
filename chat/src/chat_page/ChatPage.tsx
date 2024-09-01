import style from "./ChatPage.module.css";
import ContactsBox from "./layout/ContactsBox";
import ProfileHeader from "./layout/ProfileHeader";
import ChatBox from "./layout/ChatBox";
import ChatFooter from "./layout/ChatFooter";
import ChatHeader from "./layout/ChatHeader";

export default function ChatPage() {
  return (
    <div className={style.chatContainer}>
      <div className={style.leftContainer}>
        <ProfileHeader />
        <ContactsBox />
      </div>
      <div className={style.rightContainer}>
        <ChatHeader />
        <ChatBox />
        <ChatFooter />
      </div>
    </div>
  );
}
