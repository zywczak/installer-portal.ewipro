import { useState } from "react";

export const useFormField = (
  initial: string,
  validator?: (value: string) => string | null
) => {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  const onChange = (val: string) => {
    setValue(val);
    if (validator) setError(validator(val));
  };

  return { value, setValue, error, setError, onChange };
};
