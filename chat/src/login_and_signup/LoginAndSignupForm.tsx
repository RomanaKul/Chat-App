import { useContext, useState } from "react";
import style from "./LoginAndSignupForm.module.css";
import axios from "axios";
import { UserContext } from "../user/UserContext";

export default function LoginAndSignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const url = isSignedUp ? "/login" : "/signup";
    const { data } = await axios.post(url, { username, password });
    setLoggedInUsername(username);
    setId(data.id);
  }
  return (
    <div className={style.container}>
      <form onSubmit={handleSubmit} className={style.form}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={style.input}
          type="text"
          placeholder="Username"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={style.input}
          type="password"
          placeholder="Password"
        />
        <button className={style.button}>
          {isSignedUp ? "Log In" : "Create Account"}
        </button>
        {isSignedUp ? (
          <div className={style.text}>
            Don't have an account?&nbsp;
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsSignedUp(false);
              }}
              className={style.linkButton}
            >
              Sign up
            </button>
          </div>
        ) : (
          <div className={style.text}>
            Already have an account?&nbsp;
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsSignedUp(true);
              }}
              className={style.linkButton}
            >
              Log in
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
