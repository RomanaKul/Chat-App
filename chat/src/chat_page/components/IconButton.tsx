import style from "./Components.module.css";

interface IconButtonProps {
  icon: JSX.Element;
  type?: "button" | "submit" | "reset" | undefined;
}

export default function IconButton({ icon, type }: IconButtonProps) {
  return (
    <button type={type} className={style.button}>
      {icon}
    </button>
  );
}
