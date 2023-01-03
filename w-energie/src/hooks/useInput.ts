import { useState } from "react";

export default function useInput(
  initialValue: string | (() => string),
  onChange?: (newValue?: string) => void
): [
  string,
  (event: React.ChangeEvent<HTMLInputElement>) => void,
  (value: string | ((value: string) => string)) => void
] {
  const [state, setState] = useState<string>(initialValue);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value);
    onChange?.(event.target.value);
  };
  return [state, handleChange, setState];
}
