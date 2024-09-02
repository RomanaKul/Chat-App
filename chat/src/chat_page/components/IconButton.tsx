import style from "./Components.module.css";

interface IconButtonProps {
  icon: JSX.Element;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
}

export default function IconButton({ onClick, icon, type }: IconButtonProps) {
  return (
    <button onClick={onClick} type={type} className={style.button}>
      {icon}
    </button>
  );
}
