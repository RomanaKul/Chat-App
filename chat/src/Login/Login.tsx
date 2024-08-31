import { useState } from "react";
import style from "./Login.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className={style.container}>
      <form className={style.form}>
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
        <button className={style.button}>Login</button>
      </form>
    </div>
  );
}
