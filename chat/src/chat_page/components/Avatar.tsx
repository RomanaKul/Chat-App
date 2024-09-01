import style from "./Components.module.css";

export const Avatar = ({ username }: { username: string }) => {
  const initialLetter = username.charAt(0).toUpperCase();

  return <span className={style.avatar}>{initialLetter}</span>;
};
