import style from "./Components.module.css";

export default function StyledInput({ text }: { text: string }) {
  return <input className={style.input} type="text" placeholder={text} />;
}
