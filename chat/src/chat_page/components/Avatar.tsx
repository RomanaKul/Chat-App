import style from "./Components.module.css";

export const Avatar = ({
  online,
  username,
}: {
  online: boolean;
  username: string;
}) => {
  const initialLetter = username.charAt(0).toUpperCase();

  return (
    <span className={style.avatar}>
      <div>{initialLetter}</div>
      {online && <div className={style.online_status}>🟢</div>}
    </span>
  );
};
