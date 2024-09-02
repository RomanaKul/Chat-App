import style from "./Components.module.css";

interface StyledInputProps {
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function StyledInput({
  placeholder,
  type = "text",
  value,
  onChange,
}: StyledInputProps) {
  return (
    <input
      className={style.input}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
