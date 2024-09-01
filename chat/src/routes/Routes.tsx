import { useContext } from "react";
import LoginAndSignupForm from "../login_and_signup/LoginAndSignupForm";
import { UserContext } from "../user/UserContext";
import ChatPage from "../chat_page/ChatPage";

export default function Routes() {
  const { username, id } = useContext(UserContext);

  if (username && id) return <ChatPage />;

  return <LoginAndSignupForm />;
}
