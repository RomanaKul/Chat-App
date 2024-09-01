import style from "./Components.module.css";

export default function IconButton({ icon }: { icon: JSX.Element }) {
  return <button className={style.button}>{icon}</button>;
}
